# TSMatcher

## What is it?

It is a small library which improves `switch` statement from JavaScript/TypeScript.

## Why?

I am spoiled by advanced `match` in Scala which can match deeply, on more cases at once or use guards.
This library strives to improve very basic `switch` statement, closing the gap a bit between TypeScript and Scala (and other languages with powerful matching, like Haskell).

## Show me code!

Let's implement a basic calculator:

```typescript
import Matcher from 'ts-matcher';

type Operation = '+' | '-' | '*' | '/';

interface Computation {
  a: number;
  b: number;
  op: Operation;
  result: number;
}

// using TSMatcher library
const compute = (a: number, b: number, op: Operation): Computation => {
  const result = Matcher(op)
    .case('+', () => a + b)
    .case('-', () => a - b)
    .case('*', () => a * b)
    .case('/', () => a / b)
    .exec();
  return {a, b, op, result};
};

// using plain old switch statement
const computeSwitch = (a: number, b: number, op: Operation): Computation => {
  let result;
  switch (op) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      result = a / b;
      break;
  }
  return {a, b, op, result: <number>result};
};

compute(1, 2, '+'); // {a: 1, b: 2, op: '+', result: 3}
```

You can see that in many cases TSMatcher is more concise, yet more powerful, than the built-in `switch`.
Example above mainly demonstrates an ability to use `Matcher` as an expression which is very common in functional languages.
For more information read the features section.

## Installation

You can use npm

```
npm i -S ts-matcher
```

or grab a compiled version from this repository in `/dist/src` directory.

## Basic usage

Create a matcher similarly to how one writes a `switch`:
```typescript
const animal = 'dog';
Matcher(animal)
```

then add cases:
```typescript
  .case('spider', () => console.log('I don\'t like those.'))
  .case('dog', () => console.log('What a good boy!'))
```

and finally, don't forget to execute the matcher:
```typescript
  .exec();
```

You should see a result of out little program printed out:
```
What a good boy!
```

If no case is successful an exception is thrown.
Usually we use `default` to handle unmatched values.

```typescript
Matcher(2)
  .case(0, () => 0)
  .case(1, () => 1)
  .default(() => 9)
  .exec(); // 9
```

## Features

### Short-circuit evaluation of cases

Only first successfully matched case will get evaluated.

```typescript
Matcher(true)
  .case(true, () => console.log(0))
  .case(true, () => console.log(1))
  .exec(); // only prints "0"
```

### Deep equality

By default an equality check of the `case` is deep.

```typescript
interface AB {a: { b: number }}

const obj: AB = {a: {b: 5}};
Matcher(obj)
  .case({a: {b: 4}}, () => 'a')
  .case({a: {b: 5}}, () => 'b')
  .exec(); // 'b'
```

### Guards

You can also "match" against a function. This usage is very close to multiple `if` statements chained by `else`es.
Nice thing is that you can mix classic `case` with conditional one `caseGuarded`.

```typescript
Matcher(-5)
  .caseGuarded(x => x < 0, () => 'less')
  .case(0, () => 'zero')
  .caseGuarded(x => x > 0, () => 'more')
  .exec(); // 'less'
```

### Comparison to multiple values

In some languages, like Scala, one can have multiple values in one `case`.
With TSMatcher you can compare to multiple values too:

```typescript
Matcher('c')
  .caseMulti(['a', 'd', 'e'], () => 2)
  .caseMulti(['b', 'c'], () => 1)
  .exec(); // 1
```
