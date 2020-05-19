import * as readline from 'readline';
import {
    promises as fs,
} from 'fs';
import path from 'path';

/** circular dependency fixable when Denatural and Scanner are in the same file */
import Scanner from '../Scanner';
import Token from '../Token';
import Parser from '../Parser';
import * as Expression from '../Expression';

import {
    EXIT_CODE_ERROR,
} from '../../data/constants';

import {
    TokenType,
} from '../../data/enumerations';



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
        const parser = new Parser(tokens);
        const expression = parser.parse();

        if (this.hadError) {
            return;
        }

        if (!expression) {
            return;
        }
        console.log(new Expression.ASTPrinter().print(expression));
    }

    static error(
        entity: number | Token,
        message: string,
    ) {
        if (typeof entity === 'number') {
            // entity is a line number
            this.report(entity, '', message);
            return;
        }

        // entity is a Token
        if (entity.type === TokenType.EOF) {
            this.report(entity.line, ' at end', message);
        } else {
            this.report(entity.line, " at '" + entity.lexeme + "'", message);
        }
    }

    static report(
        line: number,
        where: string,
        message: string,
    ) {
        const value = '[line ' + line + '] Error' + where + ': ' + message;
        console.log(value);

        this.hadError = true;
    }
}


export default Denatural;
