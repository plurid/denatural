import {
    Callable,
} from '../Callable';

import DenaturalFunction from '../Function';

import DenaturalInstance from '../Instance';

import Interpreter from '../Interpreter';



class DenaturalClass implements Callable {
    public name: string;
    public methods: Map<string, DenaturalFunction>;

    constructor(
        name: string,
        methods: Map<string, DenaturalFunction>,
    ) {
        this.name = name;
        this.methods = methods;
    }

    public call(
        interpreter: Interpreter,
        args: any[],
    ) {
        const instance = new DenaturalInstance(this);

        const initializer = this.findMethod('init');
        if (initializer) {
            initializer
                .bind(instance)
                .call(interpreter, args);
        }

        return instance;
    }

    public arity() {
        const initializer = this.findMethod('init');
        if (!initializer) {
            return 0;
        }

        return initializer.arity();
    }

    public findMethod(
        name: string,
    ) {
        if (this.methods.has(name)) {
            return this.methods.get(name);
        }

        return null;
    }

    public toString() {
        return this.name;
    }
}


export default DenaturalClass;
