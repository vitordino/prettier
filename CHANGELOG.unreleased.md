<!--

NOTE: Don't forget to add a link to your GitHub profile and the PR in the end of the file.

Format:

#### Category: Title ([#PR] by [@user])

Description

```
// Input
Code Sample

// Output (Prettier stable)
Code Sample

// Output (Prettier master)
Code Sample
```

Details:

  Description: optional if the `Title` is enough to explain everything.

Examples:

#### TypeScript: Correctly handle `//` in TSX ([#5728] by [@JamesHenry])

Previously, putting `//` as a child of a JSX element in TypeScript led to an error
because it was interpreted as a comment. Prettier master fixes this issue.

<!-- prettier-ignore --\>
```js
// Input
const link = <a href="example.com">http://example.com</a>

// Output (Prettier stable)
// Error: Comment location overlaps with node location

// Output (Prettier master)
const link = <a href="example.com">http://example.com</a>;
```

-->

#### MDX: fix text with whitespace after JSX trim incorrectly ([#6340] by [@JounQin])

Previous versions format text with whitespace after JSX incorrectly in mdx, this has been fixed in this version.

<!-- prettier-ignore -->
```md
<!-- Input -->
# Heading
<Hello>
    test   <World />   test
</Hello>       123

<!-- Output (Prettier stable) -->
<Hello>
  test <World /> test
</Hello>123

<!-- Output (Prettier master) -->
<Hello>
  test <World /> test
</Hello> 123
```

#### MDX: Adjacent JSX elements should be allowed in mdx ([#6332] by [@JounQin])

Previous versions would not format adjacent JSX elements in mdx, this has been fixed in this version.

<!-- prettier-ignore -->
```jsx
// Input
<Hello>
    test   <World />   test
</Hello>123

// Output (Prettier stable)
SyntaxError: Unexpected token (3:9)
  1 | <Hello>
  2 |     test   <World />   test
> 3 | </Hello>123
    |         ^

// Output (Prettier master)
<Hello>
  test <World /> test
</Hello>123


// Input
<Hello>
    test   <World />   test
</Hello>
<Hello>
    test   <World />   test
</Hello>123

// Output (Prettier stable)
SyntaxError: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (4:1)
  2 |     test   <World />   test
  3 | </Hello>
> 4 | <Hello>
    | ^
  5 |     test   <World />   test
  6 | </Hello>123

// Output (Prettier master)
<Hello>
  test <World /> test
</Hello>
<Hello>
  test <World /> test
</Hello>123
```

#### TypeScript: Print comment following a JSX element with generic ([#6209] by [@duailibe])

Previous versions would not print this comment, this has been fixed in this version.

<!-- prettier-ignore -->
```ts
// Input
const comp = (
  <Foo<number>
    // This comment goes missing
    value={4}
  >
    Test
  </Foo>
);

// Output (Prettier stable)
const comp = <Foo<number> value={4}>Test</Foo>;

// Output (Prettier master)
const comp = (
  <Foo<number>
    // This comment goes missing
    value={4}
  >
    Test
  </Foo>
);
```

### Handlebars: Avoid adding unwanted line breaks between text and mustaches ([#6186] by [@gavinjoyce])

Previously, Prettier added line breaks between text and mustaches which resulted in unwanted whitespace in rendered output.

<!-- prettier-ignore -->
```hbs
// Input
<p>Your username is @{{name}}</p>
<p>Hi {{firstName}} {{lastName}}</p>

// Output (Prettier stable)
<p>
  Your username is @
  {{name}}
</p>
<p>
  Hi
  {{firstName}}
  {{lastName}}
</p>

// Output (Prettier master)
<p>
  Your username is @{{name}}
</p>
<p>
  Hi {{firstName}} {{lastName}}
</p>
```

### Handlebars: Improve comment formatting ([#6206] by [@gavinjoyce])

Previously, Prettier would sometimes ignore whitespace when formatting comments.

<!-- prettier-ignore -->
```hbs
// Input
<div>
  {{! Foo }}
  {{#if @foo}}
    Foo
  {{/if}}

  {{! Bar }}
  {{#if @bar}}
    Bar
  {{/if}}
</div>

// Output (Prettier stable)
<div>
  {{! Foo }}
  {{#if @foo}}
    Foo
  {{/if}}{{! Bar }}{{#if @bar}}
    Bar
  {{/if}}
</div>

// Output (Prettier master)
<div>
  {{! Foo }}
  {{#if @foo}}
    Foo
  {{/if}}
  {{! Bar }}
  {{#if @bar}}
    Bar
  {{/if}}
</div>
```

#### JavaScript: Keep unary expressions parentheses with comments ([#6217] by [@sosukesuzuki])

Previously, Prettier removes parentheses enclose unary expressions. This change modify to keep it when the expression has comments.

<!-- prettier-ignore -->
```ts
// Input
!(
  /* foo */
  foo
);
!(
  foo // foo
);

// Output (Prettier stable)
!/* foo */
foo;
!foo; // foo

// Output (Prettier master)
!(/* foo */ foo);
!(
  foo // foo
);
```

### Handlebars: Improve comment formatting ([#6234] by [@gavinjoyce])

Previously, Prettier would incorrectly decode HTML entiites.

<!-- prettier-ignore -->
```hbs
// Input
<p>
  Some escaped characters: &lt; &gt; &amp;
</p>

// Output (Prettier stable)
<p>
  Some escaped characters: < > &
</p>

// Output (Prettier master)
<p>
  Some escaped characters: &lt; &gt; &amp;
</p>
```

#### JavaScript: Stop moving comments inside tagged template literals ([#6236] by [@sosukesuzuki])

Previously, Prettier would move comments after the tag inside the template literal. This version fixes this problem.

<!-- prettier-ignore -->
```js
// Input
foo //comment
`
`;

// Output (Prettier stable)
foo` // comment
`;

// Output (Prettier master)
foo // comment
`
`;
```

#### JavaScript: Fix moving comments in function calls like `useEffect` second argument ([#6270] by [@sosukesuzuki])

This fixes a bug that was affecting function calls that have a arrow function as first argument and an array expression as second argument, such as the common React's `useEffect`. A comment in its own line before the second argument would be moved to the line above.

The bug was only present when using the Flow and TypeScript parsers.

<!-- prettier-ignore -->
```js
// Input
useEffect(
  () => {
    console.log("some code", props.foo);
  },

  // We need to disable the eslint warning here,
  // because of some complicated reason.
  // eslint-disable line react-hooks/exhaustive-deps
  []
);

// Output (Prettier stable)
useEffect(() => {
  console.log("some code", props.foo);
}, // We need to disable the eslint warning here,
// because of some complicated reason.
// eslint-disable line react-hooks/exhaustive-deps
[]);

// Output (Prettier master)
useEffect(
  () => {
    console.log("some code", props.foo);
  },

  // We need to disable the eslint warning here,
  // because of some complicated reason.
  // eslint-disable line react-hooks/exhaustive-deps
  []
);
```

#### TypeScript: Fix crashes when using `//` in JSX texts ([#6289] by [@duailibe])

This version updates the TypeScript parser to correctly handle JSX text with double slashes (`//`). In previous versions, this would cause Prettier to crash.

#### CLI: Add `--only-changed` flag ([#5910] by [@g-harel])

Flag used with `--write` to avoid re-checking files that were not changed since they were last written (with the same formatting configuration).

#### HTML, Vue: Don't break the template element included in a line shorter than print-width([#6284] by [@sosukesuzuki])

Previously, even if the line length is shorter than print-width is Prettier breaks the line with a template element.

<!-- prettier-ignore -->
```html
// Input
<template>
  <template>foo</template>
</template>

// Output (Prettier stable)
<template>
  <template
    >foo</template
  >
</template>

// Output (Prettier master)
<template>
  <template>foo</template>
</template>
```

#### JavaScript: Fix breaks indentation and idempotency when an arrow function that args include object pattern is passed to a function as parameter. ([#6301] by [@sosukesuzuki])

Previously, Prettier collapses strangely, when an arrow function that args include object pattern is passed to a function as parameter. Also, it breaks idempotency. Please see [#6294](https://github.com/prettier/prettier/issues/6294) for detail.

<!-- prettier-ignore -->
```js
// Input
foo(
  ({
    a,

    b
  }) => {}
);

// Output (Prettier stable)
foo(({ a,
  b }) => {});

// Output (Prettier master)
foo(
  ({
    a,

    b
  }) => {}
);
```

#### TypeScript: Fix specific union type breaks after opening parenthesis, but not before closing ([#6307] by [@sosukesuzuki])

Previously, union type that put with `as` , `keyof`, `[]`, other union(`|`) and intersection(`&`) breaks after opening parenthesis, but not before closing. Please see [#6303](https://github.com/prettier/prettier/issues/6303) for detail.

<!-- prettier-ignore-->
```ts
// Input
const foo = [abc, def, ghi, jkl, mno, pqr, stu, vwx, yz] as (
  | string
  | undefined
)[];

// Prettier (stable)
const foo = [abc, def, ghi, jkl, mno, pqr, stu, vwx, yz] as (
  | string
  | undefined)[];

// Prettier (master)
const foo = [abc, def, ghi, jkl, mno, pqr, stu, vwx, yz] as (
  | string
  | undefined
)[];
```

[#5910]: https://github.com/prettier/prettier/pull/5910
[#6186]: https://github.com/prettier/prettier/pull/6186
[#6206]: https://github.com/prettier/prettier/pull/6206
[#6209]: https://github.com/prettier/prettier/pull/6209
[#6217]: https://github.com/prettier/prettier/pull/6217
[#6234]: https://github.com/prettier/prettier/pull/6234
[#6236]: https://github.com/prettier/prettier/pull/6236
[#6270]: https://github.com/prettier/prettier/pull/6270
[#6289]: https://github.com/prettier/prettier/pull/6289
[#6332]: https://github.com/prettier/prettier/pull/6332
[#6284]: https://github.com/prettier/prettier/pull/6284
[#6301]: https://github.com/prettier/prettier/pull/6301
[#6307]: https://github.com/prettier/prettier/pull/6307
[#6340]: https://github.com/prettier/prettier/pull/6340
[@duailibe]: https://github.com/duailibe
[@gavinjoyce]: https://github.com/gavinjoyce
[@sosukesuzuki]: https://github.com/sosukesuzuki
[@g-harel]: https://github.com/g-harel
[@jounqin]: https://github.com/JounQin
