# Blocks


    compute OneFunction = (
        parameterOne: string,
    ) => {
        constant parameterTwo = parameterOne + 'two'

        (
            // injecting parameterTwo into the block
            parameterTwo,
        ) => {
            // execute code in the block
            constant parameterThree = parameterTwo + 'three'

            if (math.random() > 0.5) {
                exit
            } else {
                parameterThree += 'three';
            }
        } => (
            // extact parameterThree from the block
            // if the math.random goes on the then block,
            // the exit will render parameterThree with a single 'three';
            parameterThree,
        )
    }



a block can also be named


    blockOne (
        // injecting parameterTwo into the block
        parameterTwo,
    ) => {
        // execute code in the block
        constant parameterThree = parameterTwo + 'three'

        if (math.random() > 0.5) {
            exit
        } else {
            parameterThree += 'three';
        }
    } => (
        // extact parameterThree from the block
        // if the math.random goes on the then block,
        // the exit will render parameterThree with a single 'three';
        parameterThree,
    )

    blockOne() => (
        // all the scoped variables from the blockOne can be extracted here
    )



to be able to extract the history of a variable with the help of a macro

    constant j = 5

    blockTwo (
        j,
    ) => {
        variable i = 0
        constant k = 100

        while (i < j) {
            i += 1
        }
    } => (
        history:(i, 'simple'),
        k,
    )

    // j = 5
    // i = [0, 1, 2, 3, 4]
    // k = 100


    // history:(i, 'complex') would return an array where the entries hold metadata also
    // interface ComplexHistory {
    //    metadata: {
    //        timestamp: number,
    //    },
    //    value: any,
    //}
