import Interpreter from '../Interpreter';
import Environment from '../Environment';
import * as Statement from '../Statement';
import DenaturalInstance from '../Instance';
import {
    Callable,
} from '../Callable';



class DenaturalFunction implements Callable {
    private declaration: Statement.FunctionStatement;
    private closure: Environment;
    private isInitializer: boolean;

    constructor(
        declaration: Statement.FunctionStatement,
        closure: Environment,
        isInitializer: boolean,
    ) {
        this.declaration = declaration;
        this.closure = closure;
        this.isInitializer = isInitializer;
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
            if (this.isInitializer) {
                return this.closure.getAt(0, 'this');
            }

            return returnValue.value;
        }

        if (this.isInitializer) {
            return this.closure.getAt(0, 'this');
        }

        return null;
    }

    public bind(
        instance: DenaturalInstance,
    ) {
        const environment = new Environment(this.closure);
        environment.define('this', instance);
        return new DenaturalFunction(this.declaration, environment, this.isInitializer);
    }

    public arity() {
        return this.declaration.params.length;
    }

    public toString() {
        return `<fn ${this.declaration.name.lexeme} >`;
    }
}


export default DenaturalFunction;
