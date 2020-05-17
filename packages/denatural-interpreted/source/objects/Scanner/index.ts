import {
    TokenType,
} from '../../data/enumerations';

import Token from '../Token';
// import Denatural from '../Denatural';



class Scanner {
    private source: string;
    private tokens: Token[];
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;

    constructor(
        source: string,
    ) {
        this.source = source;
        this.tokens = [];
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


            // default:
            //     Denatural.error(this.line, 'Unexpected character.');
            //     break;
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

    private advance() {
        this.current += 1;
        return this.source.charAt(this.current - 1);
    }

    private isAtEnd() {
        return this.current >= this.source.length;
    }
}


export default Scanner;
