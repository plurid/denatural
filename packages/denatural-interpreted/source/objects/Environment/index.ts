import Token from '../Token';
import {
    RuntimeError,
} from '../Errors';



class Environment {
    private values: Map<string, any> = new Map();

    public define(
        name: string,
        value: any,
    ) {
        this.values.set(name, value);
    }

    public get(
        name: Token,
    ) {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }

        throw new RuntimeError(
            name,
            `Undefined variable '${name.lexeme}'`,
        );
    }

    public assign(
        name: Token,
        value: any,
    ) {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
        }

        throw new RuntimeError(
            name,
            `Undefined variable '${name.lexeme}'`,
        );
    }
}


export default Environment;
