import {
    TokenType,
} from '../../data/enumerations';

import Denatural from '../Denatural';
import * as Expression from '../Expression';
import Token from '../Token';
import {
    RuntimeError,
} from '../Errors';



class Interpreter implements Expression.Visitor<any> {
    interpret(
        expression: Expression.Expression,
    ) {
        try {
            const value = this.evaluate(expression);
            console.log(this.stringify(value));
        } catch (error) {
            Denatural.runtimeError(error);
        }
    }

    public visitLiteralExpression(
        literalExpression: Expression.LiteralExpression,
    ) {
        return literalExpression.value;
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


    private evaluate(
        expression: Expression.Expression,
    ): any {
        return expression.accept(this);
    }

    private isTruthy(
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

    private isEqual(
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

    private checkNumberOperand(
        operator: Token,
        operand: any,
    ) {
        if (typeof operand === 'number') {
            return;
        }

        throw new RuntimeError(operator, 'Operand must be a number.');
    }

    private checkNumberOperands(
        operator: Token,
        left: any,
        right: any,
    ) {
        if (typeof left === 'number' && typeof right === 'number') {
            return;
        }

        throw new RuntimeError(operator, 'Operands must be numbers.');
    }

    private stringify(
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
