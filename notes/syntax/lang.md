den|atural| language

denlang

*.den



application language
loose, dynamic typed



to use den for structure, style, and behavior
to somekind of a compiler/transpiler in TypeScript?
to have any javascript/typescript in the script bracket as valid
to have any css/sass in the style brack as valid

den as a superset of HTML-CSS-JS



compute |the name of the function|(|parameter with ugly name|, |another name aaa kdskad| * 231 - 31321)
<
    let |variable with name| : 20
    if |Fibonnaci with space| = 23
    <

    >

    deliver |variable with name|
>



compute |Fibonnaci with recursion| (|starting parameter|, |end parameter|):
    deliver compute |Fibonnaci with recursion| (|starting parameter| - 1, |end parameter| - 2)



compute |fizz buzz|(|limit number|):
    from i = 1 to |limit number|:
        let |display string| = ''

        if i % 3:
            |display string| += 'fizz'

        if i % 5:
            |display string| += 'buzz'

        if |display string| == '':
            display(i)
        else:
            display(|display string|)



from i = 1 to 100:
    display(i)


for element, index of elements:
    display(element, index)



entity |Linked List|:
    this.head = null
    this.tail = null

    compute |add to head|(value):
        let |new node| = new Node(value, this.head, null)

        if this.head:
            this.head.previous = |new node|
        else:
            this.tail = |new node|

        this.head = |new node|

    relate Node



compute Node(value, next, previous):
    this.value = value
    this.next = next
    this.previous = previous


constant list = new |Linked List|()

list.|add to head|(100)
list.|add to head|(200)


display(list)



My Programming Language

MPL

DeML



|variable with name| :: number : 23
|another variable with spaces| :: string : "string with spaces"

if |variable with name| = 23 :
	|another variable with spaces| : "string with spaces modified"


|if| : 234

test_name : 234

variableName = "fake string"



page {
    route { testing-page-1 }
	content {
        This is a testing page with a [link to testing page 2](§testing-page-2).
    }
}

page {
    route { testing-page-2 }
    content {
        header {
            style {
                backgroundColor { red }
                textTransform { uppercase }

                list {
                    backgroundColor { yellow }
                    item {
                        backgroundColor { aqua }
                    }
                }

                class {
                    listItem {
                        color { red }
                    }
                }
            }
            script {
                atClick {
                    log(
                        { button clicked }
                    )
                    style( {
                        backgroundColor { blue }
                        textTransform { lowercase }
                    } )
                }
            }
            content {
                The testing page 2 with a list
                    list {
                        item {
                            style {
                                backgroundColor { blue }
                            }
                            class {
                                listItem
                            }
                            content {
                                water
                            }
                        }
                        item {
                            style {
                                backgroundColor { red }
                            }
                            class {
                                listItem
                            }
                            content {
                                fire
                            }
                        }
                    }
            }
        }
    }
}



The IDE (plugin editor) should be powerful enough
to show only the content, the style, the script,
create on-the-spot (pluridal/3D) trees for hierarchies,
make it all very intuitive, powerful, and fast
