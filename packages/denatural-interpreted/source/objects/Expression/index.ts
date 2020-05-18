import Token from '../Token';



abstract class Expression {
    abstract accept<T>(
        visitor: Visitor<T>,
    ): T;
}


export interface Visitor<T> {
    visitBinaryExpression: (binaryExpression: BinaryExpression) => T;
    visitGroupingExpression: (groupingExpression: GroupingExpression) => T;
    visitLiteralExpression: (literalExpression: LiteralExpression) => T;
    visitUnaryExpression: (unaryExpression: UnaryExpression) => T;
}


export class BinaryExpression extends Expression {
    public left: Expression;
    public operator: Token;
    public right: Expression;

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
        return visitor.visitGroupingExpression(this);
    }
}


export class LiteralExpression extends Expression {
    public value: any;

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
    public operator: Token;
    public right: Expression;

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


export class ASTPrinter implements Visitor<string> {
    public print(
        expresssion: Expression,
    ) {
        return expresssion.accept(this);
    }

    public visitBinaryExpression(
        binaryExpression: BinaryExpression,
    ) {
        return this.parenthesize(
            binaryExpression.operator.lexeme,
            binaryExpression.left,
            binaryExpression.right,
        );
    }

    public visitGroupingExpression(
        groupingExpression: GroupingExpression,
    ) {
        return this.parenthesize(
            'group',
            groupingExpression.expression,
        );
    }

    public visitLiteralExpression(
        literalExpression: LiteralExpression,
    ) {
        if (literalExpression.value == null) {
            return 'nil';
        }

        return literalExpression.value.toString();
    }

    public visitUnaryExpression(
        unaryExpression: UnaryExpression,
    ) {
        return this.parenthesize(
            unaryExpression.operator.lexeme,
            unaryExpression.right,
        );
    }


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

        return builder.join(' ');
    }
}
