import * as Expression from '../Expression';
import * as Statement from '../Statement';
import Interpreter from '../Interpreter';
import Token from '../Token';
import Denatural from '../Denatural';

import {
    FunctionType,
    ClassType,
} from '../../data/enumerations';



class Resolver implements Expression.Visitor<any>, Statement.Visitor<any> {
    private interpreter: Interpreter;
    private scopes: Map<string, boolean>[] = [];
    private currentFunction = FunctionType.NONE;
    private currentClass = ClassType.NONE;

    constructor(
        interpeter: Interpreter,
    ) {
        this.interpreter = interpeter;
    }

    public visitBlockStatement(
        statement: Statement.BlockStatement,
    ) {
        this.beginScope();

        this.resolve(
            statement.statements,
        );

        this.endScope();

        return null;
    }

    public visitVariableStatement(
        statement: Statement.VariableStatement,
    ) {
        this.declare(statement.name);

        if (statement.initializer !== null) {
            this.resolveExpression(statement.initializer);
        }

        this.define(statement.name);

        return null;
    }

    public visitFunctionStatement(
        statement: Statement.FunctionStatement,
    ) {
        this.declare(statement.name);
        this.define(statement.name);

        this.resolveFunction(statement, FunctionType.FUNCTION);

        return null;
    }

    public visitVariableExpression(
        expression: Expression.VariableExpression,
    ) {
        const lastScopeIndex = this.scopes.length - 1;
        const scope = this.scopes[lastScopeIndex];

        if (
            this.scopes.length !== 0
            && scope.get(expression.name.lexeme) === false
        ) {
            Denatural.error(
                expression.name,
                'Cannot read local variable in its own initializer.',
            );
        }

        this.resolveLocal(
            expression,
            expression.name,
        );

        return null;
    }

    public visitAssignExpression(
        expression: Expression.AssignExpression,
    ) {
        this.resolveExpression(expression.value);
        this.resolveLocal(
            expression,
            expression.name,
        );
        return null;
    }

    public visitExpressionStatement(
        statement: Statement.ExpressionStatement,
    ) {
        this.resolveExpression(statement.expression);
        return null;
    }

    public visitBinaryExpression(
        expression: Expression.BinaryExpression,
    ) {
        this.resolveExpression(expression.left);
        this.resolveExpression(expression.right);
        return null;
    }

    public visitGroupingExpression(
        expression: Expression.GroupingExpression,
    ) {
        this.resolveExpression(expression.expression);
        return null;
    }

    public visitLogicalExpression(
        expression: Expression.LogicalExpression,
    ) {
        this.resolveExpression(expression.left);
        this.resolveExpression(expression.right);
        return null;
    }

    public visitUnaryExpression(
        expression: Expression.UnaryExpression,
    ) {
        this.resolveExpression(expression.right);
        return null;
    }

    public visitCallExpression(
        expression: Expression.CallExpression,
    ) {
        this.resolveExpression(expression.callee);

        for (const arg of expression.args) {
            this.resolveExpression(arg);
        }

        return null;
    }

    public visitLiteralExpression(
        expression: Expression.LiteralExpression,
    ) {
        return null;
    }

    public visitGetExpression(
        expression: Expression.GetExpression,
    ) {
        this.resolveExpression(expression.object);
        return null;
    }

    public visitSetExpression(
        expression: Expression.SetExpression,
    ) {
        this.resolveExpression(expression.value);
        this.resolveExpression(expression.object);
        return null;
    }

    public visitThisExpression(
        expression: Expression.ThisExpression,
    ) {
        if (this.currentClass === ClassType.NONE) {
            Denatural.error(
                expression.keyword,
                "Cannot use 'this' outside of a class.",
            );
            return null;
        }

        this.resolveLocal(expression, expression.keyword);
        return null;
    }

    public visitIfStatement(
        statement: Statement.IfStatement,
    ) {
        this.resolveExpression(statement.condition);
        this.resolveStatement(statement.thenBranch);

        if (
            statement.elseBranch !== null
        ) {
            this.resolveStatement(statement.elseBranch);
        }

        return null;
    }

    public visitPrintStatement(
        statement: Statement.PrintStatement,
    ) {
        this.resolveExpression(statement.expression);
        return null;
    }

    public visitWhileStatement(
        statement: Statement.WhileStatement,
    ) {
        this.resolveExpression(statement.condition);
        this.resolveStatement(statement.body);

        return null;
    }

    public visitReturnStatement(
        statement: Statement.ReturnStatement,
    ) {
        if (this.currentFunction === FunctionType.NONE) {
            Denatural.error(
                statement.keyword,
                'Cannot return from top-level code.',
            );
        }

        if (statement) {
            if (this.currentFunction === FunctionType.INITIALIZER) {
                Denatural.error(
                    statement.keyword,
                    'Cannot return a value from an initializer.',
                );
            }

            this.resolveExpression(statement.value);
        }

        return null;
    }

    public visitClassStatement(
        statement: Statement.ClassStatement,
    ) {
        const enclosingClass = this.currentClass;
        this.currentClass = ClassType.CLASS;

        this.declare(statement.name);
        this.define(statement.name);

        this.beginScope();

        const lastScopeIndex = this.scopes.length - 1;
        const scope = this.scopes[lastScopeIndex];
        scope.set(
            'this',
            true,
        );
        this.scopes[lastScopeIndex] = new Map(scope);

        for (const method of statement.methods) {
            let declaration = FunctionType.METHOD;
            if (method.name.lexeme === 'init') {
                declaration = FunctionType.INITIALIZER;
            }

            this.resolveFunction(method, declaration);
        }

        this.endScope();

        this.currentClass = enclosingClass;

        return null;
    }


    public resolve(
        statements: Statement.Statement[],
    ) {
        for (const statement of statements) {
            this.resolveStatement(statement);
        }
    }

    public resolveStatement(
        statement: Statement.Statement,
    ) {
        statement.accept(this);
    }

    public resolveExpression(
        expression: Expression.Expression,
    ) {
        expression.accept(this);
    }

    public resolveFunction(
        functionStatement: Statement.FunctionStatement,
        type: FunctionType,
    ) {
        const enclosingFunction = this.currentFunction;
        this.currentFunction = type;

        this.beginScope();

        for (const param of functionStatement.params) {
            this.declare(param);
            this.define(param);
        }

        this.resolve(functionStatement.body);
        this.endScope();

        this.currentFunction = enclosingFunction;
    }


    private beginScope() {
        this.scopes.push(
            new Map(),
        );
    }

    private endScope() {
        this.scopes.pop();
    }

    private declare(
        name: Token,
    ) {
        if (
            this.scopes.length === 0
        ) {
            return;
        }

        const lastScopeIndex = this.scopes.length - 1;

        const scope = this.scopes[lastScopeIndex];

        if (scope.has(name.lexeme)) {
            Denatural.error(
                name,
                'Variable with this name already declared in this scope.',
            );
        }

        scope.set(
            name.lexeme,
            false,
        );
        this.scopes[lastScopeIndex] = new Map(scope);
    }

    private define(
        name: Token,
    ) {
        if (
            this.scopes.length === 0
        ) {
            return;
        }

        const lastScopeIndex = this.scopes.length - 1;

        const scope = this.scopes[lastScopeIndex];
        scope.set(
            name.lexeme,
            true,
        );
        this.scopes[lastScopeIndex] = new Map(scope);
    }

    private resolveLocal(
        expression: Expression.Expression,
        name: Token,
    ) {
        for (const [key, scope] of this.scopes.entries()) {
            if (scope.has(name.lexeme)) {
                this.interpreter.resolve(
                    expression,
                    this.scopes.length - 1 - key,
                )
            }
        }

        // Not found. Assume it is global.
    }
}


export default Resolver;
