desyntaxed language - to let the programmer define the syntax



to be able to serialize functions? — to be able to generate ASTs from the language and to transfer it across network




https://youtu.be/QM1iUe6IofM?t=2538

controlled scope sight

function () {
    const x = 20
    const y = 10

    {
        // x and y are visible
    }

    use x {
        // only x is visibile
    }
}
