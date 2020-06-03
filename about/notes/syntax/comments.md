programmable (importable/linkable) comments


a comment block

    <<<
    <
        // any variables defined here are usable within the body of comment
        // this is just regular denatural code, scoped to the comment block
        constant functionCommentsA = import(‘./path/to/file).myFunction // will actually get the comment section of my function
        constant A = functionCommentsA.myComment

        // the single rule to be respected is that variables/constants need to resolve to a string in order to be injected into the comment
    >

    <Foo> // annotate the following paragraph with the variable name Foo to be used in another comment
    comment block

    <<A>> // inject the comment A
    >>>



example


    // adder.denatural

    <<<
        <Add>
        The adder adds `a` to `b`.
    >>>
    compute adder (
        a: number
        b: number
    ) <
        deliver a + b
    >


    // multiplier.denatural

    <<<
        <
            const AddComment = import('adder.denatural').adder.Add
        >

        The `multiplier` is based on the `adder`, repeating the adding of `a` for `b` times.

        <<AddComment>>
    >>>
    compute multiplier (
        a: number
        b: number
    ) <
        variable temporary = a

        for b times <
            temporary = adder(temporary, a)
        >

        deliver temporary
    >
