import {
    TokenType,
} from '../../data/enumerations';

import Token from '../Token';
import Denatural from '../Denatural';



class Scanner {
    private source: string;
    private tokens: Token[];
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;
    private keywords: Record<string, TokenType>;

    constructor(
        source: string,
    ) {
        this.source = source;
        this.tokens = [];

        this.keywords = {
            and: TokenType.AND,
            class: TokenType.CLASS,
            else: TokenType.ELSE,
            false: TokenType.FALSE,
            for: TokenType.FOR,
            fun: TokenType.FUN,
            if: TokenType.IF,
            nil: TokenType.NIL,
            or: TokenType.OR,
            print: TokenType.PRINT,
            return: TokenType.RETURN,
            super: TokenType.SUPER,
            this: TokenType.THIS,
            true: TokenType.TRUE,
            var: TokenType.VAR,
            while: TokenType.WHILE,
        }
    }

    public scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        const endOfFile = new Token(TokenType.EOF, '', null, this.line);
        this.tokens.push(endOfFile);

        return this.tokens;
    }


    private scanToken() {
        const character = this.advance();

        switch (character) {
            case '(':
                this.addToken(TokenType.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenType.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(TokenType.LEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenType.RIGHT_BRACE);
                break;
            case ',':
                this.addToken(TokenType.COMMA);
                break;
            case '.':
                this.addToken(TokenType.DOT);
                break;
            case '-':
                this.addToken(TokenType.MINUS);
                break;
            case '+':
                this.addToken(TokenType.PLUS);
                break;
            case ';':
                this.addToken(TokenType.SEMICOLON);
                break;
            case '*':
                this.addToken(TokenType.STAR);
                break;

            case '!':
                this.addToken(this.match('=')
                    ? TokenType.BANG_EQUAL
                    : TokenType.BANG
                );
                break;
            case '=':
                this.addToken(this.match('=')
                    ? TokenType.EQUAL_EQUAL
                    : TokenType.EQUAL
                );
                break;
            case '<':
                this.addToken(this.match('=')
                    ? TokenType.LESS_EQUAL
                    : TokenType.LESS
                );
                break;
            case '>':
                this.addToken(this.match('=')
                    ? TokenType.GREATER_EQUAL
                    : TokenType.GREATER
                );
                break;

            case '/':
                if (this.match('/')) {
                    // A comment goes until the end of the line.
                    while (this.peek() !== '\n' && !this.isAtEnd()) {
                        this.advance();
                    }
                } else {
                    this.addToken(TokenType.SLASH);
                }
                break;

            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace.
                break;

            case '\n':
                this.line++;
                break;

            case '"':
                this.string();
                break;

            default:
                if (this.isDigit(character)) {
                    this.number();
                } else if (this.isAlpha(character)) {
                    this.identifier();
                } else {
                    Denatural.error(this.line, 'Unexpected character.');
                }
                break;
        }
    }

    private addToken(
        type: TokenType,
    ) {
        this.addTokenLiteral(type, null);
    }

    private addTokenLiteral(
        type: TokenType,
        literal: any,
    ) {
        const text = this.source.substring(this.start, this.current);

        const newToken = new Token(type, text, literal, this.line);

        this.tokens.push(newToken);
    }

    private advance() {
        this.current += 1;
        return this.source.charAt(this.current - 1);
    }

    private match(
        expected: string,
    ) {
        if (this.isAtEnd()) {
            return false;
        }

        if (this.source.charAt(this.current) !== expected) {
            return false;
        }

        this.current += 1;
        return true;
    }

    private peek() {
        if (this.isAtEnd()) {
            return '\0';
        }

        return this.source.charAt(this.current);
    }

    private string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n') {
                this.line += 1;
            }

            this.advance();
        }

        // Unterminated string.
        if (this.isAtEnd()) {
            Denatural.error(this.line, 'Unterminated string.');
            return;
        }

        const value = this.source.substring(this.start + 1, this.current);
        this.addTokenLiteral(TokenType.STRING, value);
    }

    private isDigit(
        character: string,
    ) {
        return character >= '0' && character <= '9';
    }

    private number() {
        while (this.isDigit(this.peek())) {
            this.advance();
        }

        // Look for a fractional part.
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
        // Consume the "."
        this.advance();

        while (this.isDigit(this.peek())) {
            this.advance();
        }
      }

        this.addTokenLiteral(
            TokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current))
        );
    }

    private peekNext() {
        if (this.current + 1 >= this.source.length) {
            return '\0';
        }

        return this.source.charAt(this.current + 1);
    }

    private isAlpha(
        c: string,
    ) {
        return (c >= 'a' && c <= 'z')
            || (c >= 'A' && c <= 'Z')
            || c === '_';
    }

    private isAlphaNumeric(
        c: string,
    ) {
        return this.isAlpha(c) || this.isDigit(c);
    }

    private identifier() {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }

        // See if the identifier is a reserved word.
        const text = this.source.substring(this.start, this.current);
        let type = this.keywords[text];

        if (!type) {
            type = TokenType.IDENTIFIER;
        }

        this.addToken(type);
    }

    private isAtEnd() {
        return this.current >= this.source.length;
    }
}


export default Scanner;
