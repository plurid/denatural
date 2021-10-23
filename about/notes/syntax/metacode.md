To be able to define the language operators using a meta-language which gets parsed to generate a preview (a similar mechanism as how one writes LaTeX and previews mathematics notation)




// https://unicode-table.com/en/2771
define
    id [hrpabo addhalf]
    name Heavy Right-Pointing Angle Bracket Ornament
    sign ❱ // or 2771
    act (left, right) {
        return (left + right) / 2
    }


text

a = 5
b = 7
c = a \hrpabo b // 6
or
c = a \addhalf b


preview

a = 5
b = 7
c = a ❱ b





// https://unicode-table.com/en/2969
define
    id [rhbdalhbd firsthree]
    name Rightwards Harpoon with Barb Down Above Leftwards Harpoon with Barb Down
    sign ⥩ // or 2969
    act (left, right) {
        return left = right.slice(0, 3)
    }


text

a \firsthree '12345'


preview

a ⥩ '12345'





// https://unicode-table.com/en/22F5
define
    id [eda authenticated]
    name Element of with Dot Above
    sign ⋵ // or 22F5
    act (_, right) {
        // check user authentication
        return true;
    }


text

if \authenticated user {
    // do things
}


preview

if ⋵ user {
    // do things
}
