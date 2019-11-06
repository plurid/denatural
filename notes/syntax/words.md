variables (words) definition

    constant a = 20

    word a = 20

    word f = (> parameters)
    <
        subword run (> parameters)
        <
            log: 'running with |parameters[1]|'
        >
    >

    f > run: 'test' // logs 'running with test'


words can be reassigned
