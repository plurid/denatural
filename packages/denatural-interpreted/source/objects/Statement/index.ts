import Token from '../Token';

import {
    Expression,
} from '../Expression';



export abstract class Statement {
    abstract accept<T>(
        visitor: Visitor<T>,
    ): T;
}


export interface Visitor<T> {
    visitExpressionStatement: (expressionStatement: ExpressionStatement) => T;
    visitIfStatement: (ifStatement: IfStatement) => T;
    visitPrintStatement: (printStatement: PrintStatement) => T;
    visitVariableStatement: (variableStatement: VariableStatement) => T;
    visitBlockStatement: (blockStatement: BlockStatement) => T;
}


export class ExpressionStatement extends Statement {
    public expression: Expression;

    constructor(
        expression: Expression,
    ) {
        super();

        this.expression = expression;
    }

    accept<T>(
        visitor: Visitor<T>,
    ) {
        return visitor.visitExpressionStatement(this);
    }
}


export class IfStatement extends Statement {
    public condition: Expression;
    public thenBranch: Statement;
    public elseBranch: Statement;

    constructor(
        condition: Expression,
        thenBranch: Statement,
        elseBranch: Statement,
    ) {
        super();

        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    accept<T>(
        visitor: Visitor<T>,
    ) {
        return visitor.visitIfStatement(this);
    }
}


export class PrintStatement extends Statement {
    public expression: Expression;

    constructor(
        expression: Expression,
    ) {
        super();

        this.expression = expression;
    }

    accept<T>(
        visitor: Visitor<T>,
    ) {
        return visitor.visitPrintStatement(this);
    }
}


export class VariableStatement extends Statement {
    public name: Token;
    public initializer: Expression | null;

    constructor(
        name: Token,
        initializer: Expression | null,
    ) {
        super();

        this.name = name;
        this.initializer = initializer;
    }

    accept<T>(
        visitor: Visitor<T>,
    ) {
        return visitor.visitVariableStatement(this);
    }
}


export class BlockStatement extends Statement {
    public statements: Statement[];

    constructor(
        statements: Statement[],
    ) {
        super();

        this.statements = statements;
    }

    accept<T>(
        visitor: Visitor<T>,
    ) {
        return visitor.visitBlockStatement(this);
    }
}
