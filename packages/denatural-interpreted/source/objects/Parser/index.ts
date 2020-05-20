import Denatural from '../Denatural';
import Token from '../Token';
import * as Expression from '../Expression';
import * as Statement from '../Statement';

import {
    TokenType,
} from '../../data/enumerations';



class Parser {
    private tokens: Token[];
    private current = 0;
    private ParseError = class ParseError extends Error {};

    constructor(
        tokens: Token[],
    ) {
        this.tokens = tokens;
    }


    public parse() {
        const statements: any[] = [];

        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }

        return statements;
    }

    public declaration() {
        try {
            if (
                this.match(TokenType.VAR)
            ) {
                return this.variableDeclaration();
            }

            return this.statement();
        } catch (error) {
            this.synchronize();
            return null;
        }
    }

    public variableDeclaration() {
        const name = this.consume(TokenType.IDENTIFIER, 'Expect variable name.');

        let initializer = null;
        if (
            this.match(TokenType.EQUAL)
        ) {
            initializer = this.expression();
        }

        this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");

        return new Statement.VariableStatement(name, initializer);
    }

    public statement() {
        if (this.match(TokenType.PRINT)) {
            return this.printStatement();
        }

        return this.expressionStatement();
    }

    public printStatement() {
        const value = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
        return new Statement.PrintStatement(value);
    }

    public expressionStatement() {
        const expression = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
        return new Statement.ExpressionStatement(expression);
    }

    public expression() {
        return this.assignment();
    }


    public assignment(): any {
        const expression = this.equality();

        if (
            this.match(TokenType.EQUAL)
        ) {
            const equals = this.previous();
            const value = this.assignment();

            if (expression instanceof Expression.VariableExpression) {
                const name = expression.name;
                return new Expression.AssignExpression(name, value);
            }

            this.error(equals, 'Invalid assignment target.');
        }

        return expression;
    }

    public equality() {
        let expression = this.comparison();

        while (
            this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)
        ) {
            const operator = this.previous();
            const right = this.comparison();
            expression = new Expression.BinaryExpression(expression, operator, right);
        }

        return expression;
    }

    public comparison() {
        let expression = this.addition();

        while (
            this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)
        ) {
            const operator = this.previous();
            const right = this.addition();
            expression = new Expression.BinaryExpression(expression, operator, right);
        }

        return expression;
    }

    public addition() {
        let expression = this.multiplication();

        while (
            this.match(TokenType.MINUS, TokenType.PLUS)
        ) {
            const operator = this.previous();
            const right = this.multiplication();
            expression = new Expression.BinaryExpression(expression, operator, right);
        }

        return expression;
    }

    public multiplication() {
        let expression = this.unary();

        while (
            this.match(TokenType.SLASH, TokenType.STAR)
        ) {
            const operator = this.previous();
            const right = this.unary();
            expression = new Expression.BinaryExpression(expression, operator, right);
        }

        return expression;
    }

    public unary(): Expression.Expression {
        if (
            this.match(TokenType.BANG, TokenType.MINUS)
        ) {
            const operator = this.previous();
            const right = this.unary();
            return new Expression.UnaryExpression(operator, right);
        }

        return this.primary();
    }

    public primary(): Expression.Expression {
        if (
            this.match(TokenType.FALSE)
        ) {
            return new Expression.LiteralExpression(false);
        }

        if (
            this.match(TokenType.TRUE)
        ) {
            return new Expression.LiteralExpression(true);
        }

        if (
            this.match(TokenType.NIL)
        ) {
            return new Expression.LiteralExpression(null);
        }

        if (
            this.match(TokenType.NUMBER, TokenType.STRING)
        ) {
            return new Expression.LiteralExpression(this.previous().literal);
        }

        if (
            this.match(TokenType.IDENTIFIER)
        ) {
            return new Expression.VariableExpression(this.previous());
        }

        if (
            this.match(TokenType.LEFT_PAREN)
        ) {
            const expression = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
            return new Expression.GroupingExpression(expression);
        }

        throw this.error(this.peek(), "Expect expression.");
    }


    private consume(
        type: TokenType,
        message: string,
    ) {
        if (this.check(type)) {
            return this.advance();
        }

        throw this.error(this.peek(), message);
    }

    private error(
        token: Token,
        message: string,
    ) {
        Denatural.error(token, message);

        return new this.ParseError();
    }

    private synchronize() {
        this.advance();

        while(
            !this.isAtEnd()
        ) {
            if (this.previous().type === TokenType.SEMICOLON) {
                return;
            }

            switch (this.peek().type) {
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return;
            }

            this.advance();
        }
    }

    private match(
        ...types: TokenType[]
    ) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    private check(
        type: TokenType,
    ) {
        if (this.isAtEnd()) {
            return false;
        }

        return this.peek().type === type;
    }

    private advance() {
        if (!this.isAtEnd()) {
            this.current += 1;
        }

        return this.previous();
    }

    private isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }

    private peek() {
        return this.tokens[this.current];
    }

    private previous() {
        return this.tokens[this.current - 1];
    }
}


export default Parser;
