import {
    TokenType,
} from '../../data/enumerations';



class Token {
    public type: TokenType;
    public lexeme: string;
    public literal: any;
    public line: number;

    constructor(
        type: TokenType,
        lexeme: string,
        literal: any,
        line: number,
    ) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    public toString() {
        return this.type + ' ' + this.lexeme + ' ' + this.literal;
    }
}


export default Token;
