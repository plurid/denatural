import Interpreter from '../Interpreter';
import Environment from '../Environment';
import * as Statement from '../Statement';



export interface Callable {
    call: (
        interpreter: Interpreter,
        args: any[],
    ) => any;
    arity: () => number;
    toString: () => string;
}


class DenaturalFunction implements Callable {
    private declaration: Statement.FunctionStatement;

    constructor(
        declaration: Statement.FunctionStatement,
    ) {
        this.declaration = declaration;
    }

    public call(
        interpreter: Interpreter,
        args: any[],
    ) {
        const environment = new Environment(interpreter.globals);

        for (const parameter of this.declaration.params) {
            environment.define(
                parameter.lexeme,
                parameter,
            );
        }

        interpreter.executeBlock(
            this.declaration.body,
            environment,
        );

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
