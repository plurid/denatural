import {
    RuntimeError,
} from '../Errors';



class Return extends RuntimeError {
    public value: any;

    constructor(
        value: any,
    ) {
        super(null, '');

        this.value = value;
    }
}


export default Return;
