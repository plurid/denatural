import Token from '../Token';
import {
    RuntimeError,
} from '../Errors';



class Environment {
    private enclosing: Environment | undefined;
    private values: Map<string, any> = new Map();

    constructor(
        enclosing?: Environment,
    ) {
        this.enclosing = enclosing;
    }

    public define(
        name: string,
        value: any,
    ) {
        this.values.set(name, value);
    }

    public get(
        name: Token,
    ): any {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }

        if (this.enclosing) {
            return this.enclosing.get(name);
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

        if (this.enclosing) {
            this.enclosing.assign(name, value);
            return;
        }

        throw new RuntimeError(
            name,
            `Undefined variable '${name.lexeme}'`,
        );
    }
}


export default Environment;
