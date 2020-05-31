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
