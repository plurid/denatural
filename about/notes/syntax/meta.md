elements = [
    {
        name: 'One',
        arguments: {
            foo: 'foo',
        },
        delivers: {
            foo: 'foo',
        }
    },
    {
        name: 'Two',
        arguments: {
            boo: 'boo',
        },
        delivers: {
            boo: 'boo',
        },
    },
    {
        name: 'Three',
        arguments: {
            doo: 'doo',
        },
        delivers: {
            doo: 'doo',
        },
    },
]


compute WriteTime|elements.each -> element.name| = (
    |elements.each -> element.arguments|
) <
    deliver {
        |element.delivers.each -> delivery|
    }
>


------

This will generate at compile-time three computes WriteTimeOne, WriteTimeTwo, WriteTimeThree, each with their own arguments, and deliveries.

The computes can also be used at write-time just like normal computes, for example one could call

    WriteTimeOne()

and get the object

    {
        foo: 'foo',
    }


Data-Specified Programming






----


Skeletal Arrays

instead of this:

elements = [
    {
        name: 'One',
        arguments: {
            foo: 'foo',
        },
        delivers: {
            foo: 'foo',
        }
    },
    {
        name: 'Two',
        arguments: {
            boo: 'boo',
        },
        delivers: {
            boo: 'boo',
        },
    },
    {
        name: 'Three',
        arguments: {
            doo: 'doo',
        },
        delivers: {
            doo: 'doo',
        },
    },
]



to have


elements|
    name,
    arguments,
    delivers,
| = [
    'One',
    {
        foo: 'foo'
    },
    {
        foo: 'foo',
    },
    -
    Two,
    {
        boo: 'boo'
    },
    {
        boo: 'boo',
    },
    -
    'Two',
    {
        doo: 'doo'
    },
    {
        doo: 'doo',
    },
]
