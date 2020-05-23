import {
    Callable,
} from '../Callable';

import DenaturalInstance from '../Instance';

import Interpreter from '../Interpreter';



class DenaturalClass implements Callable {
    public name: string;

    constructor(
        name: string,
    ) {
        this.name = name;
    }

    public call(
        interpreter: Interpreter,
        args: any[],
    ) {
        const instance = new DenaturalInstance(this);
        return instance;
    }

    public arity() {
        return 0;
    }

    public toString() {
        return this.name;
    }
}


export default DenaturalClass;
