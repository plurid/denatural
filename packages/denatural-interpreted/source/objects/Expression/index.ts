import Token from '../Token';



abstract class Expression {
}


export interface Visitor<T> {
    visitBinaryExpression: (binaryExpression: BinaryExpression) => T;
    visitGroupingExpression: (groupingExpression: GroupingExpression) => T;
    visitLiteralExpression: (literalExpression: LiteralExpression) => T;
    visitUnaryExpression: (unaryExpression: UnaryExpression) => T;
}


export class BinaryExpression extends Expression {
    private left: Expression;
    private operator: Token;
    private right: Expression;

    constructor(
        left: Expression,
        operator: Token,
        right: Expression,
    ) {
        super();

        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(
        visitor: Visitor<T>,
    ) {
        return visitor.visitBinaryExpression(this);
    }
}


export class GroupingExpression extends Expression {
    private expression: Expression;

    constructor(
        expression: Expression,
    ) {
        super();

        this.expression = expression;
    }

    accept<T>(
        visitor: Visitor<T>,
    ) {
        return visitor.visitGroupingExpression(this);
    }
}


export class LiteralExpression extends Expression {
    private value: any;

    constructor(
        value: any,
    ) {
        super();

        this.value = value;
    }

    accept<T>(
        visitor: Visitor<T>,
    ) {
        return visitor.visitLiteralExpression(this);
    }
}


export class UnaryExpression extends Expression {
    private operator: Token;
    private right: Expression;

    constructor(
        operator: Token,
        right: Expression,
    ) {
        super();

        this.operator = operator;
        this.right = right;
    }

    accept<T>(
        visitor: Visitor<T>,
    ) {
        return visitor.visitUnaryExpression(this);
    }
}
