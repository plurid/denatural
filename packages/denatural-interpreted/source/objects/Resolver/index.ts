import * as Expression from '../Expression';
import * as Statement from '../Statement';
import Interpreter from '../Interpreter';
import Token from '../Token';
import Denatural from '../Denatural';



class Resolver implements Expression.Visitor<any>, Statement.Visitor<any> {
    private interpreter: Interpreter;
    private scopes: Map<string, boolean>[] = [];

    constructor(
        interpeter: Interpreter,
    ) {
        this.interpreter = interpeter;
    }

    public visitBlockStatement(
        statement: Statement.BlockStatement,
    ) {
        this.beginScope();

        this.resolve(
            statement.statements,
        );

        this.endScope();

        return null;
    }

    public visitVariableStatement(
        statement: Statement.VariableStatement,
    ) {
        this.declare(statement.name);

        if (statement.initializer !== null) {
            this.resolveExpression(statement.initializer);
        }

        this.define(statement.name);

        return null;
    }

    public visitFunctionStatement(
        statement: Statement.FunctionStatement,
    ) {
        this.declare(statement.name);
        this.define(statement.name);

        this.resolveFunction(statement);

        return null;
    }

    public visitVariableExpression(
        expression: Expression.VariableExpression,
    ) {
        const lastScopeIndex = this.scopes.length - 1;
        const scope = this.scopes[lastScopeIndex];

        if (
            this.scopes.length === 0
            && scope.get(expression.name.lexeme) === false
        ) {
            Denatural.error(
                expression.name,
                'Cannot read local variable in its own initializer.',
            );
        }

        this.resolveLocal(
            expression,
            expression.name,
        );

        return null;
    }

    public visitAssignExpression(
        expression: Expression.AssignExpression,
    ) {
        this.resolveExpression(expression.value);
        this.resolveLocal(
            expression,
            expression.name,
        );
        return null;
    }

    public visitExpressionStatement(
        statement: Statement.ExpressionStatement,
    ) {
        this.resolveStatement(statement);
        return null;
    }

    public visitBinaryExpression(
        expression: Expression.BinaryExpression,
    ) {
        this.resolveExpression(expression.left);
        this.resolveExpression(expression.right);
        return null;
    }

    public visitGroupingExpression(
        expression: Expression.GroupingExpression,
    ) {
        return null;
    }

    public visitLogicalExpression(
        expression: Expression.LogicalExpression,
    ) {
        this.resolveExpression(expression.left);
        this.resolveExpression(expression.right);
        return null;
    }

    public visitUnaryExpression(
        expression: Expression.UnaryExpression,
    ) {
        this.resolveExpression(expression.right);
        return null;
    }

    public visitCallExpression(
        expression: Expression.CallExpression,
    ) {
        return null;
    }

    public visitLiteralExpression(
        expression: Expression.LiteralExpression,
    ) {
        return null;
    }

    public visitIfStatement(
        statement: Statement.IfStatement,
    ) {
        this.resolveExpression(statement.condition);
        this.resolveStatement(statement.thenBranch);

        if (
            statement.elseBranch !== null
        ) {
            this.resolveStatement(statement.elseBranch);
        }

        return null;
    }

    public visitPrintStatement(
        statement: Statement.PrintStatement,
    ) {
        this.resolveExpression(statement.expression);
        return null;
    }

    public visitWhileStatement(
        statement: Statement.WhileStatement,
    ) {
        this.resolveExpression(statement.condition);
        this.resolveStatement(statement.body);

        return null;
    }

    public visitReturnStatement(
        statement: Statement.ReturnStatement,
    ) {
        return null;
    }



    public resolve(
        statements: Statement.Statement[],
    ) {
        for (const statement of statements) {
            this.resolveStatement(statement);
        }
    }

    public resolveStatement(
        statement: Statement.Statement,
    ) {
        statement.accept(this);
    }

    public resolveExpression(
        expression: Expression.Expression,
    ) {
        expression.accept(this);
    }

    public resolveFunction(
        functionStatement: Statement.FunctionStatement,
    ) {
        this.beginScope();

        for (const param of functionStatement.params) {
            this.declare(param);
            this.define(param);
        }

        this.resolve(functionStatement.body);
        this.endScope();
    }


    private beginScope() {
        this.scopes.push(
            new Map(),
        );
    }

    private endScope() {
        this.scopes.pop();
    }

    private declare(
        name: Token,
    ) {
        if (
            this.scopes.length === 0
        ) {
            return;
        }

        const lastScopeIndex = this.scopes.length - 1;

        const scope = this.scopes[lastScopeIndex];
        scope.set(
            name.lexeme,
            false,
        );
        this.scopes[lastScopeIndex] = new Map(scope);
    }

    private define(
        name: Token,
    ) {
        if (
            this.scopes.length === 0
        ) {
            return;
        }

        const lastScopeIndex = this.scopes.length - 1;

        const scope = this.scopes[lastScopeIndex];
        scope.set(
            name.lexeme,
            true,
        );
        this.scopes[lastScopeIndex] = new Map(scope);
    }

    private resolveLocal(
        expression: Expression.Expression,
        name: Token,
    ) {
        for (const [key, scope] of this.scopes.entries()) {
            if (scope.has(name.lexeme)) {
                this.interpreter.resolve(
                    expression,
                    this.scopes.length - 1 - key,
                )
            }
        }

        // Not found. Assume it is global.
    }
}


export default Resolver;
