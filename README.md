Document Query Notation
=======================

[![NPM][npm-image]][npm-url]
[![Build Status][build-status-img]][build-status-link]
[![GitHub Project][github-image]][github-url]
[![API Documentation][api-docs-image]][api-docs-url]


[npm-image]: https://img.shields.io/npm/v/@frontmeans/doqry.svg?logo=npm
[npm-url]: https://www.npmjs.com/package/@frontmeans/doqry
[build-status-img]: https://github.com/frontmeans/doqry/workflows/Build/badge.svg
[build-status-link]: https://github.com/frontmeans/doqry/actions?query=workflow%3ABuild
[github-image]: https://img.shields.io/static/v1?logo=github&label=GitHub&message=project&color=informational
[github-url]: https://github.com/frontmeans/doqry
[api-docs-image]: https://img.shields.io/static/v1?logo=typescript&label=API&message=docs&color=informational
[api-docs-url]: https://frontmeans.github.io/doqry/


Structured CSS Selectors
------------------------

Doqry represents CSS selectors as data structures rather than trying to parse selectors text.

Structured CSS selector is one of:
- raw CSS selector text,
- CSS selector part, or
- an array consisting of strings, parts, and their combinators.

Raw CSS selector text is never interpreted and is used verbatim.

CSS combinator is one of: `>`, `+`, or `~`.

CSS selector part is a structure representing selectors like
`element-name#id.class1.classN[attr1][attr2]:pseudo-class::pseudo-element`.
Each selector part is represented by corresponding property.:
- Element selector:
  `{ e: 'element-name' }` for `element-name`.
- Element selector in XML namespace:
  `{ ns: 'ns-prefix', e: 'element-name' }` for `ns-prefix | element-name`.
- Universal element selector:
  `{ e: '*' }`, which is the same as `{}` for `*`.
- Universal element selector in XML namespace:
  `{ ns: 'ns-prefix', e: '*' }`, which is the same as `{ ns: 'ns-prefix' }` for `ns-prefix | *`.
- Element identifier:
  `{ i: 'element-id' }` for `#element-id`.
- Element class:
  `{ c: 'class-name' }` for `.class-name`.
- Multiple element classes:
  `{ c: ['class-1', 'class-2'] }` for `.class-1.class-2`.
- Attribute selector:
  `{ u: ['disabled'] }` for `[disabled]`,
  `{ u: ['lang', '|=', 'en'] }` for `[lang |= "en"]`.
- Pseudo-element:
  `{ e: 'li', u: ['::', 'after'] }` for `li::after`.
- Pseudo-class:
  `{ u: [':', 'host', { c: 'active' }] }` for `:host(.active)`,
  `{ u: [':', 'is', [{ e: 'ul' }, '>', { e: 'li' }], [{ c: 'menu'}, { c: 'menu-item'}]] }`
  for `:is(ul > li, .menu > .menu-item)`
- Additional selectors:
  `{ e: 'a', s: '[href^=https://]:visited' }` for `a[href^=https://]:visited`.
- Raw CSS selector:
  `{ s: '.my-selector' }` for `.my-selector`.

Selector part may combine multiple properties. Parts may be combined too.
E.g. `[{ e: 'ul', c: 'unstyled' }, '>', { e: 'li' }]` corresponds to `ul.unstyled > li` CSS selector.


### Qualifiers

CSS selector may include qualifiers. Qualifiers do not correspond to CSS selectors directly. Instead, they are used
internally to classify selectors. E.g. they may represent [at-rule] selectors.

Qualifiers represented by `$` property of structured CSS selector part, that may contain either one qualifier, or an
array of qualifiers:
`{ c: 'sr-only', $: '@media=screen' }`.

Each qualifier is a string in the `<name>[=<value>]` format, where the `<name>` may be qualified and consist of multiple
colon-separated parts like `block:visibility:hidden`.

The presence of `q1:q2:q3=v` qualifier means the same as presence of `q1`, `q1:q2`, `q1:q2:q3`, and `q1:q2:q3=v`
qualifiers.

[at-rule]: https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
