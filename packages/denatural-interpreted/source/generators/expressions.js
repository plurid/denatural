const {
    promises: fs,
} = require('fs');
const path = require('path');



// constants
const SPACE = '    ';


// expressions types
const expressions = [
    ['Assign', 'name: Token', 'value: Expression'],
    ['Binary', 'left: Expression', 'operator: Token', 'right: Expression'],
    ['Call', 'callee: Expression', 'paren: Token', 'args: Expression[]'],
    ['Get', 'object: Expression', 'name: Token'],
    ['Grouping', 'expression: Expression'],
    ['Literal', 'value: any'],
    ['Logical', 'left: Expression', 'operator: Token', 'right: Expression'],
    ['Set', 'object: Expression', 'name: Token', 'value: Expression'],
    ['Super', 'keyword: Token', 'method: Token'],
    ['This', 'keyword: Token'],
    ['Unary', 'operator: Token', 'right: Expression'],
    ['Variable', 'name: Token'],
];


// static texts
const textImports = `import Token from '../Token';


`;


const textTop = `
export abstract class Expression {
    abstract accept<T>(
        visitor: Visitor<T>,
    ): T;
}

`;

const textVisitor = generateTextVisitor(expressions);

const textExpressions = generateTextExpressions(expressions);

const textASTPrinter = generateTextASTPrinter(expressions);


// generation
function generateTextVisitor(
    expressions,
) {
    let textMethods = [];

    for (const expression of expressions) {
        const name = expression[0];
        const textExpression = `${SPACE}visit${name}Expression: (${name.toLowerCase()}Expression: ${name}Expression) => T;`;
        textMethods.push(textExpression);
    }

    const textVisitor = `
export interface Visitor<T> {
${textMethods.join('\n')}
}

`;

    return textVisitor;
}


function generateTextExpressions(
    expressions,
) {
    let textClasses = [];

    for (const expression of expressions) {
        const name = expression[0];
        const parameters = expression.slice(1);

        const textPublic = parameters.map(parameter => `${SPACE}public ${parameter};`);
        const textConstructor = parameters.map(parameter => `${SPACE}${SPACE}${parameter},`);
        const textParameters = parameters.map(parameter => `${SPACE}${SPACE}this.${parameter.split(':')[0]} = ${parameter.split(':')[0]};`);

        const textClass = `
export class ${name}Expression extends Expression {
${textPublic.join('\n')}

    constructor(
${textConstructor.join('\n')}
    ) {
        super();

${textParameters.join('\n')}
    }

    accept<T>(
        visitor: Visitor<T>,
    ) {
        return visitor.visit${name}Expression(this);
    }
}
`;

        textClasses.push(textClass);
    }

    return textClasses.join('\n');
}


function generateTextASTPrinter(
    expressions,
) {
    let textMethods = [];

    for (const expression of expressions) {
        const name = expression[0];

        switch (name) {
            case 'Literal': {
                const textExpression = `
    public visitLiteralExpression(
        literalExpression: LiteralExpression,
    ) {
        if (literalExpression.value == null) {
            return 'nil';
        }

        return literalExpression.value.toString();
    }
`;
                textMethods.push(textExpression);
                break;
            }

            case 'Grouping': {
                const textExpression = `
    public visitGroupingExpression(
        groupingExpression: GroupingExpression,
    ) {
        return this.parenthesize(
            'group',
            groupingExpression.expression,
        );
    }
`;
                textMethods.push(textExpression);
                break;
            }

            default: {
                const lowerCaseName = name.toLowerCase();
                const textLeftExpression = expression.find(expression => expression.includes('left'))
                    ? `${SPACE}${SPACE}${SPACE}${lowerCaseName}Expression.left,`
                    : '';
                const textRightExpression = expression.find(expression => expression.includes('right'))
                    ? `${SPACE}${SPACE}${SPACE}${lowerCaseName}Expression.right,`
                    : '';
                const textParanthesizeParameters = [
                    textLeftExpression,
                    textRightExpression,
                ].filter(parameter => parameter !== '');

                const textExpression = `
    public visit${name}Expression(
        ${lowerCaseName}Expression: ${name}Expression,
    ) {
        return this.parenthesize(
            ${lowerCaseName}Expression.operator.lexeme,
${textParanthesizeParameters.join('\n')}
        );
    }
`;
                textMethods.push(textExpression);
            }
        }
    }

    const textASTPrinter = `

export class ASTPrinter implements Visitor<string> {
    public print(
        expresssion: Expression,
    ) {
        return expresssion.accept(this);
    }
${textMethods.join('')}

    private parenthesize(
        name: string,
        ...expressions: Expression[]
    ) {
        const builder: string[] = [];

        builder.push('(');
        builder.push(name);

        for (const expression of expressions) {
            builder.push(' ');
            builder.push(expression.accept(this));
        }

        builder.push(')');

        return builder.join('');
    }
}
`;

    return textASTPrinter;
}



const textFile = textImports
    + textTop
    + textVisitor
    + textExpressions
    + textASTPrinter;


fs.writeFile(
    path.join(__dirname, 'Expression_index.ts'),
    textFile,
);
