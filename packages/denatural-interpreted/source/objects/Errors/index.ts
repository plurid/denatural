import Token from '../Token';



export class RuntimeError extends Error {
    public token: Token | null;

    constructor(
        token: Token | null,
        message: string,
    ) {
        super(message);
        this.token = token;
    }
}
