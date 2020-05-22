import {
    TokenType,
} from '../../data/enumerations';

import Denatural from '../Denatural';
import Environment from '../Environment';
import * as Expression from '../Expression';
import * as Statement from '../Statement';
import Token from '../Token';
import {
    RuntimeError,
} from '../Errors';
import DenaturalFunction, {
    Callable,
} from '../Callable';



class Interpreter implements Expression.Visitor<any>, Statement.Visitor<any> {
    public globals: Environment = new Environment();
    private environment: Environment = this.globals;

    constructor() {
        this.globals.define('clock', new class Clock implements Callable {
            public arity() {
                return 0;
            }

            public call(
                interpreter: Interpreter,
                args: any[],
            ) {
                return Math.floor(Date.now() / 1000);
            }

            public toString() {
                return '<native fn>';
            }
        })
    }

    public interpret(
        statements: Statement.Statement[],
    ) {
        try {
            for (const statement of statements) {
                this.execute(statement);
            }
        } catch (error) {
            Denatural.runtimeError(error);
        }
    }

    public execute(
        statement: Statement.Statement,
    ) {
        statement.accept(this);
    }



    /** STATEMENTS */
    public visitBlockStatement(
        statement: Statement.BlockStatement,
    ) {
        this.executeBlock(
            statement.statements,
            new Environment(this.environment),
        );

        return null;
    }

    public visitExpressionStatement(
        statement: Statement.ExpressionStatement,
    ) {
        this.evaluate(statement.expression);
        return null;
    }

    public visitIfStatement(
        statement: Statement.IfStatement,
    ) {
        if (
            this.isTruthy(this.evaluate(statement.condition))
        ) {
            this.execute(statement.thenBranch);
        } else if (statement.elseBranch !== null) {
            this.execute(statement.elseBranch);
        }

        return null;
    }

    public visitPrintStatement(
        statement: Statement.PrintStatement,
    ) {
        const value = this.evaluate(statement.expression);
        console.log(this.stringify(value));
        return null;
    }

    public visitVariableStatement(
        statement: Statement.VariableStatement,
    ) {
        let value = null;

        if (statement.initializer !== null) {
            value = this.evaluate(statement.initializer);
        }

        this.environment.define(statement.name.lexeme, value);

        return null;
    }

    public visitWhileStatement(
        statement: Statement.WhileStatement,
    ) {
        while (
            this.isTruthy(this.evaluate(statement.condition))
        ) {
            this.execute(statement.body);
        }

        return null;
    }

    public visitFunctionStatement(
        statement: Statement.FunctionStatement,
    ) {
        const denaturalFunction = new DenaturalFunction(statement);

        this.environment.define(
            statement.name.lexeme,
            denaturalFunction,
        );

        return null;
    }



    /** EXPRESSIONS */
    public visitLiteralExpression(
        literalExpression: Expression.LiteralExpression,
    ) {
        return literalExpression.value;
    }

    public visitLogicalExpression(
        expression: Expression.LogicalExpression,
    ) {
        const left = this.evaluate(expression.left);

        if (expression.operator.type === TokenType.OR) {
            if (
                this.isTruthy(left)
            ) {
                return left;
            }
        } else {
            if (
                !this.isTruthy(left)
            ) {
                return left;
            }
        }

        return this.evaluate(expression.right);
    }

    public visitBinaryExpression(
        binaryExpression: Expression.BinaryExpression,
    ) {
        const left = this.evaluate(binaryExpression.left);
        const right = this.evaluate(binaryExpression.right);

        switch (binaryExpression.operator.type) {
            case TokenType.MINUS:
                this.checkNumberOperands(binaryExpression.operator, left, right);
                return left - right;
            case TokenType.PLUS:
                if (typeof left === 'number' && typeof right === 'number') {
                    return left + right;
                }

                if (typeof left === 'string' && typeof right === 'string') {
                    return left + right;
                }

                throw new RuntimeError(
                    binaryExpression.operator,
                    'Operands must be two numbers or two strings.',
                );

            case TokenType.SLASH:
                this.checkNumberOperands(binaryExpression.operator, left, right);
                return left / right;
            case TokenType.STAR:
                this.checkNumberOperands(binaryExpression.operator, left, right);
                return left * right;

            case TokenType.GREATER:
                this.checkNumberOperands(binaryExpression.operator, left, right);
                return left > right;
            case TokenType.GREATER_EQUAL:
                this.checkNumberOperands(binaryExpression.operator, left, right);
                return left >= right;
            case TokenType.LESS:
                this.checkNumberOperands(binaryExpression.operator, left, right);
                return left < right;
            case TokenType.LESS_EQUAL:
                this.checkNumberOperands(binaryExpression.operator, left, right);
                return left <= right;

            case TokenType.BANG_EQUAL:
                return !this.isEqual(left, right);
            case TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right);
        }

        // Unreachable.
        return null;
    }

    public visitGroupingExpression(
        groupingExpression: Expression.GroupingExpression,
    ) {
        return this.evaluate(groupingExpression.expression);
    }

    public visitUnaryExpression(
        unaryExpression: Expression.UnaryExpression,
    ) {
        const right = this.evaluate(unaryExpression.right);

        switch (unaryExpression.operator.type) {
            case TokenType.BANG:
                return !this.isTruthy(right);
            case TokenType.MINUS:
                this.checkNumberOperand(unaryExpression.operator, right);
                return -right;
        }

        // Unreachable.
        return null;
    }

    public visitVariableExpression(
        expression: Expression.VariableExpression,
    ) {
        return this.environment.get(expression.name);
    }

    public visitAssignExpression(
        expression: Expression.AssignExpression,
    ) {
        const value = this.evaluate(expression.value);

        this.environment.assign(expression.name, value);
        return value;
    }

    public visitCallExpression(
        expression: Expression.CallExpression,
    ) {
        const callee = this.evaluate(expression.callee);

        const args: any[] = [];
        for (const arg of expression.args) {
            args.push(this.evaluate(arg));
        }

        if (typeof callee.call !== 'function') {
            throw new RuntimeError(
                expression.paren,
                'Can only call functions and classes.',
            );
        }

        const callable = callee as Callable;

        const argsLength = args.length;
        const arity = callable.arity();

        if (argsLength !== arity) {
            throw new RuntimeError(
                expression.paren,
                `Expected ${arity} arguments, but got ${argsLength}.`,
            );
        }

        return callable.call(this, args);
    }


    public executeBlock(
        statements: Statement.Statement[],
        environment: Environment,
    ) {
        const previous = this.environment;

        try {
            this.environment = environment;

            for (const statement of statements) {
                this.execute(statement);
            }
        } catch (error) {
            this.environment = previous;
            return;
        } finally {
            this.environment = previous;
        }
    }

    public evaluate(
        expression: Expression.Expression,
    ): any {
        return expression.accept(this);
    }

    public isTruthy(
        object: any,
    ) {
        if (object === null) {
            return false;
        }

        if (typeof object === 'boolean') {
            return object;
        }

        return true;
    }

    public isEqual(
        a: any,
        b: any,
    ) {
        // nil is only equal to nil.
        if (a === null && b === null) {
            return true;
        }

        if (a === null) {
            return false;
        }

        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }

        return a === b;
    }

    public checkNumberOperand(
        operator: Token,
        operand: any,
    ) {
        if (typeof operand === 'number') {
            return;
        }

        throw new RuntimeError(operator, 'Operand must be a number.');
    }

    public checkNumberOperands(
        operator: Token,
        left: any,
        right: any,
    ) {
        if (typeof left === 'number' && typeof right === 'number') {
            return;
        }

        throw new RuntimeError(operator, 'Operands must be numbers.');
    }

    public stringify(
        object: any,
    ) {
        if (object === null) {
            return 'nil';
        }

        if (typeof object === 'number') {
            let text = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2);
            }
            return text;
        }

        return object.toString();
    }
}


export default Interpreter;
