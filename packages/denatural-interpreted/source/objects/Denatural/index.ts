import * as readline from 'readline';

import {
    promises as fs,
} from 'fs';

import Scanner from '../Scanner';

import {
    EXIT_CODE_ERROR,
} from '../../data/constants';



class Denatural {
    private hadError = false;
    private args: string[];


    constructor(
        args: string[],
    ) {
        this.args = args;
    }


    async main() {
        const length = this.args.length;

        if (length > 3) {
            console.log('\n\tUsage: denatural <source-file>\n');
            return
        }

        if (length === 3) {
            await this.runFile(this.args[2]);
            return;
        }

        this.runREPL();
    }

    async runFile(
        file: string,
    ) {
        try {
            const data = await fs.readFile(file, 'utf-8');

            this.run(data);

            if (this.hadError) {
                process.exit(EXIT_CODE_ERROR);
            }
        } catch (error) {
            console.log(`Error reading file: ${file}`);
        }
    }

    runREPL() {
        console.log('\n\tdenatural read-evaluate-print loop >>>\n');

        let inputline = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const recursiveAsyncReadLine = () => {
            inputline.question('> ', (answer) => {
                if (answer == 'exit') {
                    return inputline.close();
                }

                this.run(answer);
                this.hadError = false;

                recursiveAsyncReadLine();
            });
        };

        recursiveAsyncReadLine();
    }

    run(
        data: string,
    ) {
        const scanner = new Scanner(data);
        const tokens = scanner.scanTokens();

        for (const token of tokens) {
            console.log(token);
        }
    }

    error(
        line: number,
        message: string,
    ) {
        this.report(line, '', message);
    }

    report(
        line: number,
        where: string,
        message: string,
    ) {
        const log = '[line ' + line + '] Error' + where + ': ' + message;

        console.log(log);
        this.hadError = true;
    }
}


export default Denatural;
