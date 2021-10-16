libraries


instead of versioning packages - to version exports



// C-like

export function (
    version 0.0.0-1
    pure true           // no side effects
    network false       // doesn't use the network
    externals false     // doesn't use external packages
    // or
    // externals {
    //     some-dependency 0.0.0-1version
    // }
    globals false       // doesn't use external variables
) adder (
    a: number,
    b: number,
) {
    return a + b
}



// cleaner

export (
    version 0.0.0-1
    pure true           // no side effects
    network false       // doesn't use the network
    externals false     // doesn't use external packages (functions, variables)
    // or
    // externals {
    //     some-dependency 0.0.0-1version
    // }
) adder (
    a number
    b number
) a + b


export (
    version 0.0.0-1
) Class {
    constructor () {

    }

    public (
        version 0.0.0-2
    ) call () {

    }
}



to differentiate between definition and instantiation


import {
    adder 0.0.0-1
} from 'namespace/external-package'


const result = adder(5, 7)


