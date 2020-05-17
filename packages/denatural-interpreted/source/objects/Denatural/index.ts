import * as readline from 'readline';
import {
    promises as fs,
} from 'fs';
import path from 'path';

import Scanner from '../Scanner';

import {
    EXIT_CODE_ERROR,
} from '../../data/constants';



class Denatural {
    static hadError = false;

    static async main(
        args: string[],
    ) {
        const length = args.length;

        if (length > 3) {
            console.log('\n\tUsage: denatural <source-file>\n');
            return
        }

        if (length === 3) {
            await this.runFile(args[2]);
            return;
        }

        this.runREPL();
    }

    static async runFile(
        file: string,
    ) {
        try {
            const filepath = path.join(process.cwd(), file);
            const data = await fs.readFile(filepath, 'utf-8');

            this.run(data);

            if (this.hadError) {
                process.exit(EXIT_CODE_ERROR);
            }
        } catch (error) {
            console.log(`Error reading file: ${file}`);
        }
    }

    static runREPL() {
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

    static run(
        data: string,
    ) {
        const scanner = new Scanner(data);
        const tokens = scanner.scanTokens();

        for (const token of tokens) {
            console.log(token);
        }
    }

    static error(
        line: number,
        message: string,
    ) {
        this.report(line, '', message);
    }

    static report(
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
