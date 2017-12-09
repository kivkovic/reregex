# reregex

A library implementing PCRE-style (PHP/Perl) recursive regex expressions in Javascript. Allows recursive pattern matching using the `(?n)` syntax, `n` being the number of a captured group. For example, this pattern

```
\(([^()]*|(?0))*\)
```

recurses the entire pattern (group 0) using the expression `(?0)`, and will match balanced parentheses and their content:

```
()
((()))
(a(bc(d(ef)g)h)i)
```

This is achieved by transpiling recursive regex expressions into native javascript regexes, by unfolding the recursion into a nested sequence. The level of recursion

## How to use

Import the ReRegex class. Provide the pattern as a string to the class constructor, then call the `toRegExp` method to get a native js RegExp object:

```javascript
const ReRegex = require('./reregex').ReRegex;

const pattern = new ReRegex('\\(([^()]*|(?0))*\\)')
	.toRegExp();

console.log(pattern.constructor)
// outputs: [Function: RegExp]

console.log('(a(bc(d(ef)g)h)i) (a) ((b)'.match(pattern));
// outputs: [ '(a(bc(d(ef)g)h)i)', '(a)', '(b)' ]
```

The toRegExp method accepts two optional parameters:
`.toRegExp(flags = 'g', n = 100)`

The first parameter, `flags` is a string containing the flags passed to the native RegExp constructor.

The second parameter, `n` is the reursion depth level (default is 100). This value may be overriden by providing an integer parameter to `derecurse`. Safe values for simple recursive patterns (i.e. no recursions referencing other recursions) are around 200-300.

Expressions with recursive groups referencing other recursive groups can escalate exponentially both in terms of transpilation time and the size of the resulting RegExp. For example, the expression: `ab(c|(?2))de(f|(?0))g(?1)h` derecursed to depth 10 produces a 2691 kB regex string.
