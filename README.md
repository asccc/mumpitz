Mumpitz
=======

Mumpitz is a jQuery-like wrapper class for DOM elements.

The API focuses on modern browser-technologies and does not provide fallbacks/polyfills.

Everything should work as expected. But there are no tests ... so "expected" is undefined and may vary.

(This is not a serious project and intended as a joke)

## Files

src/mumpitz.js ES2016

dist/mumpitz.js ES2015


## API

### Mumpitz(selector, context = document)

Searches for elements matching the given selector.
A new instance of the internal Mumpitz wrapper class is returned.

### Mumpitz.noConflict()

Returns the previous value stored in $ before the Mumpitz-library was loaded.

### Mumpitz.fn

Exported prototype of the internal Mumpitz wrapper class.
Use this object to extend Mumpitz.

## Instance properties

### nodes

The collection of nodes.

### length

The length of the collection.

## Instance methods

#### [Symbol.iterator]()

Iterate over the collection using a for-of loop.

### top()

Returns the first element in the collection. Throws an `Error` if the collection is empty.

### is(selector)

Returns true if the top() element matches the given selector.

### find(selector)

Searches for elements using the top() element as context. Equivalent to `Mumpitz(selector, this.top())`.

### hasClass(className)

Checks if the top() element has the given class-name.

### removeClass(className)

Removes the given class-name from all elements in the collection.

### addClass(className)

Adds the given class-name to all elements in the collection.

### toggleClass(className)

Toggles the given class-name in all elements in the collection.

