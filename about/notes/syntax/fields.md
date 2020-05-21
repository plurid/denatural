cell A {

}


field One {
    cells {
        A,
    },
    pulse {
        // tick every timestep
    }
}

field Two {
    cells {
        A,
    },
}

space A {
    // fields
    One,
    Two,
}

A()
