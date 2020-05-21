import Interpreter from '../Interpreter';



export interface Callable {
    call: (
        interpreter: Interpreter,
        args: any[],
    ) => any;
    arity: () => number;
}
