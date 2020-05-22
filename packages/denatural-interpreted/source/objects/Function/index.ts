import Interpreter from '../Interpreter';
import Environment from '../Environment';
import * as Statement from '../Statement';
import {
    Callable,
} from '../Callable';



class DenaturalFunction implements Callable {
    private declaration: Statement.FunctionStatement;
    private closure: Environment;

    constructor(
        declaration: Statement.FunctionStatement,
        closure: Environment,
    ) {
        this.declaration = declaration;
        this.closure = closure;
    }

    public call(
        interpreter: Interpreter,
        args: any[],
    ) {
        const environment = new Environment(this.closure);

        for (const key of this.declaration.params.keys()) {
            environment.define(
                this.declaration.params[key].lexeme,
                args[key],
            );
        }

        try {
            interpreter.executeBlock(
                this.declaration.body,
                environment,
            );
        } catch (returnValue) {
            return returnValue.value;
        }

        return null;
    }

    public arity() {
        return this.declaration.params.length;
    }

    public toString() {
        return `<fn ${this.declaration.name.lexeme} >`;
    }
}


export default DenaturalFunction;
