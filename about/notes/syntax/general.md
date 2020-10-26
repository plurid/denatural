# Types

+ boolean: `true` and `false`;
+ string: with `'` or `"` or `;
+ number: `integer` (`integer8`, `integer16`, etc.), `real`;
+ undefined;
+ maps: using `{ key: value }`
+ lists: using `[ comma-separated ]`


```
constant aBoolean<boolean> : false
constant aString<string> : 'a string'
constant aDefaultNumber<number> : 0
constant aNumber<number<integer>> : 1
constant aNumber<number<integer16>> : 2
constant aNumber<number<real>> : 2.3
constant undefinedValue<undefined> : undefined
```


The type can be obtained from a variable

```
constant someNumber<number<integer16>> : 2

// anotherNumber has the type of someNumber, number<integer16>
constant anotherNumber<someNumber> : 3
```


```
:       assignment

=       equal to
!=      not equal to
>       greater than
<       less than
>=      greater than or equal to
<=      less than or equal to
```



# Variables

```
// mutable
let name

// immutable
constant name

constant |name with spaces|
```



# Comments

```
// single line

/* */ multiline
```



# Block

```
<

>
```



# Control Structures

```
if condition
<
    block
>
```

```
if condition
<
    // block
> else
<
    // block
>
```

```
if condition
<
    // block
> else if condition
<
    // block
>
```



```
constant a: 1
constant b: 2
constant c: 3

if (a < b and b < c) or c > a
<
    // block
> else if condition
<
    // block
>
```



# Maps and Lists

Deon-like


```
constant aMap {
    key value
}
```

```
constant aList [
    value1
    value2
]
```



# Distribution


```
function one <
    // the context of the function
> (
    // the parameters of the function
) {
    // the body of the function
}

the context is a deon map containing addresses (?)
```
