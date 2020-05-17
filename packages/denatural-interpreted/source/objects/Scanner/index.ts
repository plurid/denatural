class Scanner {
    private data: string;

    constructor(
        data: string,
    ) {
        this.data = data;
    }

    public scanTokens() {
        return [this.data];
    }
}


export default Scanner;
