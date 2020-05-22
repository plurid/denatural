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
                this.match(TokenType.FUN)
            ) {
                return this.function('function');
            }

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
        if (
            this.match(TokenType.FOR)
        ) {
            return this.forStatement();
        }

        if (
            this.match(TokenType.IF)
        ) {
            return this.ifStatement();
        }

        if (
            this.match(TokenType.PRINT)
        ) {
            return this.printStatement();
        }

        if (
            this.match(TokenType.WHILE)
        ) {
            return this.whileStatement();
        }

        if (
            this.match(TokenType.LEFT_BRACE)
        ) {
            return new Statement.BlockStatement(this.block());
        }

        return this.expressionStatement();
    }

    public forStatement(): any {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");

        let initializer;
        if (
            this.match(TokenType.SEMICOLON)
        ) {
            initializer = null;
        } else if (
            this.match(TokenType.VAR)
        ) {
            initializer = this.variableDeclaration();
        } else {
            initializer = this.expressionStatement();
        }

        let condition = null;
        if (
            !this.check(TokenType.SEMICOLON)
        ) {
            condition = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

        let increment = null;
        if (
            !this.check(TokenType.RIGHT_PAREN)
        ) {
            increment = this.expression();
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

        let body = this.statement();

        if (increment !== null) {
            body = new Statement.BlockStatement(
                [
                    body,
                    new Statement.ExpressionStatement(increment)
                ],
            );
        }

        if (condition === null) {
            condition = new Expression.LiteralExpression(true);
        }

        body = new Statement.WhileStatement(condition, body);

        if (initializer !== null) {
            body = new Statement.BlockStatement(
                [
                    initializer,
                    body,
                ],
            );
        }

        return body;
    }

    public ifStatement(): Statement.IfStatement {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");

        const thenBranch = this.statement();
        let elseBranch = null;
        if (
            this.match(TokenType.ELSE)
        ) {
            elseBranch = this.statement();
        }

        return new Statement.IfStatement(condition, thenBranch, elseBranch);
    }

    public printStatement(): Statement.PrintStatement {
        const value = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
        return new Statement.PrintStatement(value);
    }

    public whileStatement(): Statement.WhileStatement {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
        const body = this.statement();

        return new Statement.WhileStatement(condition, body);
    }

    public expressionStatement() {
        const expression = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
        return new Statement.ExpressionStatement(expression);
    }

    public expression() {
        return this.assignment();
    }


    public function(
        kind: string,
    ) {
        const name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);

        this.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);

        const parameters: Token[] = [];

        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                if (parameters.length >= 255) {
                    this.error(this.peek(), 'Cannot have more than 255 parameters.');
                }

                parameters.push(
                    this.consume(TokenType.IDENTIFIER, 'Expect parameter name.')
                );
            } while (
                this.match(TokenType.COMMA)
            );
        }

        this.consume(TokenType.RIGHT_PAREN, `Expect ')' after parameters.`);

        this.consume(TokenType.LEFT_BRACE, `Expect '{' before ${kind} name..`);

        const body = this.block();

        return new Statement.FunctionStatement(name, parameters, body);
    }

    public block() {
        const statements: any[] = [];

        while (
            !this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()
        ) {
            statements.push(this.declaration());
        }

        this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");

        return statements;
    }

    public assignment(): any {
        const expression = this.or();

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

    public or() {
        let expression = this.and();

        while (
            this.match(TokenType.OR)
        ) {
            const operator = this.previous();
            const right = this.and();
            expression = new Expression.LogicalExpression(expression, operator, right);
        }

        return expression;
    }

    public and() {
        let expression = this.equality();

        while (
            this.match(TokenType.AND)
        ) {
            const operator = this.previous();
            const right = this.equality();
            expression = new Expression.LogicalExpression(expression, operator, right);
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

        return this.call();
    }

    public call() {
        let expression = this.primary();

        while (true) {
            if (
                this.match(TokenType.LEFT_PAREN)
            ) {
                expression = this.finishCall(expression);
            } else {
                break;
            }
        }

        return expression;
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

    private finishCall(
        callee: Expression.Expression,
    ) {
        const args: Expression.Expression[] = [];

        if (
            !this.check(TokenType.RIGHT_PAREN)
        ) {
            do {
                if (args.length >= 255) {
                    this.error(this.peek(), 'Cannot have more than 255 arguments.');
                }

                args.push(this.expression());
            } while (
                this.match(TokenType.COMMA)
            )
        }

        const paren = this.consume(TokenType.RIGHT_PAREN, "Expect ')' after arguments.");

        return new Expression.CallExpression(callee, paren, args);
    }
}


export default Parser;
