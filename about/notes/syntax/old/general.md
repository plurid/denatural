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



----


    constant condition = true

    constant a = if condition
    <
        constant b = 20
        expose b
    >
    else
    <
        expose c
    >


---


    compute One ()
    <
        constant condition = true

        constant a = if condition
        <
            constant b = 20
            expose b

            if (b > 20)
            <
                return true
            >
        >
        else
        <
            expose c
        >
    >



----



units

    constant metricLength (millimetre) = 5
    constant metricLength (millimetre) = 5
    constant metricLengthAmerican (millimeter) = 5
    constant imperialLength (inch) = 3

    constant sumError = metricLength + imperialLength // compile error
    constant sum = metricLength + metricLengthAmerican // ??
