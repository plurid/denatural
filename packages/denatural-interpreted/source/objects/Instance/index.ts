import DenaturalClass from '../Class';
import Token from '../Token';
import {
    RuntimeError,
} from '../Errors';



class DenaturalInstance {
    private denaturalClass: DenaturalClass;
    private fields: Map<string, any> = new Map();

    constructor(
        denaturalClass: DenaturalClass,
    ) {
        this.denaturalClass = denaturalClass;
    }

    get(
        name: Token,
    ) {
        if (this.fields.has(name.lexeme)) {
            return this.fields.get(name.lexeme);
        }

        const method = this.denaturalClass.findMethod(name.lexeme);
        if (method) {
            return method.bind(this);
        }

        throw new RuntimeError(
            name,
            `Undefined property '${name.lexeme}'.`,
        );
    }

    set(
        name: Token,
        value: any,
    ) {
        this.fields.set(name.lexeme, value);
    }

    toString() {
        return this.denaturalClass.name + ' instance';
    }
}


export default DenaturalInstance;
