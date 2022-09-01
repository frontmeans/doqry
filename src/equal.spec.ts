import { DEFAULT__NS, NamespaceDef } from '@frontmeans/namespace-aliaser';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { doqryEqual } from './equal';

describe('doqryEqual', () => {
  let ns1: NamespaceDef;
  let ns2: NamespaceDef;

  beforeEach(() => {
    ns1 = new NamespaceDef('ns/1', 'ns1');
    ns2 = new NamespaceDef('ns/2', 'ns2');
  });

  it('compares length', () => {
    expect(doqryEqual([{ e: 'ul' }, '>', { e: 'li' }], [{ e: 'ul' }, { e: 'li' }])).toBe(false);
  });
  it('compares combinators', () => {
    expect(doqryEqual([{ e: 'h1' }, '>', { e: 'h2' }], [{ e: 'h1' }, '+', { e: 'h2' }])).toBe(
      false,
    );
    expect(doqryEqual([{ e: 'h1' }, '>', { e: 'h2' }], [{ e: 'h1' }, '>', { e: 'h2' }])).toBe(true);
    expect(
      doqryEqual([{ e: 'h1' }, '>', { e: 'h2' }], [{ e: 'h1' }, { e: 'h2' }, { e: 'h3' }]),
    ).toBe(false);
    expect(
      doqryEqual([{ e: 'h1' }, { e: 'h2' }, { e: 'h3' }], [{ e: 'h1' }, '>', { e: 'h2' }]),
    ).toBe(false);
  });
  it('compares namespaces', () => {
    expect(doqryEqual([{ ns: 'a', e: 'span' }], [{ ns: 'b', e: 'span' }])).toBe(false);
    expect(doqryEqual([{ ns: 'a', e: 'span' }], [{ ns: ns2, e: 'span' }])).toBe(false);
    expect(doqryEqual([{ ns: 'a', e: 'span' }], [{ ns: 'a', e: 'span' }])).toBe(true);
    expect(doqryEqual([{ ns: ns1, e: 'span' }], [{ ns: 'b', e: 'span' }])).toBe(false);
    expect(doqryEqual([{ ns: ns1, e: 'span' }], [{ ns: ns2, e: 'span' }])).toBe(false);
    expect(doqryEqual([{ ns: ns1, e: 'span' }], [{ ns: ns1, e: 'span' }])).toBe(true);
    expect(doqryEqual([{ ns: 'a', e: 'span' }], [{ e: 'span' }])).toBe(false);
    expect(doqryEqual([{ e: 'span' }], [{ ns: 'b', e: 'span' }])).toBe(false);
  });
  it('compares names', () => {
    expect(doqryEqual([{ e: 'span' }], [{ e: 'div' }])).toBe(false);
    expect(doqryEqual([{ e: 'span' }], [{ e: ['span', ns2] }])).toBe(false);
    expect(doqryEqual([{ e: 'span' }], [{ e: 'span' }])).toBe(true);
    expect(doqryEqual([{ e: 'span' }], [{ e: ['span', DEFAULT__NS] }])).toBe(true);
    expect(doqryEqual([{ e: ['span', ns1] }], [{ e: ['div', ns1] }])).toBe(false);
    expect(doqryEqual([{ e: ['span', ns1] }], [{ e: ['span', ns2] }])).toBe(false);
    expect(doqryEqual([{ e: ['span', ns1] }], [{ e: 'span' }])).toBe(false);
    expect(doqryEqual([{ e: ['span', ns1] }], [{ s: 'some' }])).toBe(false);
    expect(doqryEqual([{ e: ['span', ns1] }], [{ e: ['span', ns1] }])).toBe(true);
    expect(doqryEqual([{ e: 'span' }], [{ s: 'some' }])).toBe(false);
    expect(doqryEqual([{ s: 'some' }], [{ e: 'span' }])).toBe(false);
  });
  it('compares classes', () => {
    expect(doqryEqual([{ c: ['a'] }], [{ c: ['b'] }])).toBe(false);
    expect(doqryEqual([{ c: ['a'] }], [{ c: ['a', 'c'] }])).toBe(false);
    expect(doqryEqual([{ c: ['a'] }], [{ c: [['a', ns1]] }])).toBe(false);
    expect(doqryEqual([{ c: ['a'] }], [{ c: ['a'] }])).toBe(true);
    expect(doqryEqual([{ c: [['a', ns1]] }], [{ c: ['b'] }])).toBe(false);
    expect(doqryEqual([{ c: [['a', ns1]] }], [{ c: [['a', ns2]] }])).toBe(false);
    expect(doqryEqual([{ c: [['a', ns1]] }], [{ c: [['b', ns1]] }])).toBe(false);
    expect(doqryEqual([{ c: [['a', ns1]] }], [{ c: [['a', ns1]] }])).toBe(true);
    expect(doqryEqual([{ c: ['a'] }], [{ s: 'some' }])).toBe(false);
    expect(doqryEqual([{ s: 'some' }], [{ c: ['a'] }])).toBe(false);
  });
  it('compares attribute sub-selectors', () => {
    expect(doqryEqual([{ u: [['attr']] }], [{ u: [['attr']] }])).toBe(true);
    expect(doqryEqual([{ u: [['attr']] }], [{ u: [['attr2']] }])).toBe(false);
    expect(doqryEqual([{ u: [['attr']] }], [{ u: [['attr', '=', 'value']] }])).toBe(false);
    expect(doqryEqual([{ u: [['attr', '=', 'value']] }], [{ u: [['attr', '=', 'value2']] }])).toBe(
      false,
    );
    expect(doqryEqual([{ e: 'div', u: [['id']] }], [{ e: 'div' }])).toBe(false);
    expect(doqryEqual([{ e: 'div' }], [{ e: 'div', u: [['id']] }])).toBe(false);
    expect(doqryEqual([{ u: [['attr']] }], [{ u: [['attr'], ['attr2']] }])).toBe(false);
  });
  it('compares pseudo- sub-selectors', () => {
    expect(doqryEqual([{ u: [[':', 'host']] }], [{ u: [[':', 'host']] }])).toBe(true);
    expect(doqryEqual([{ u: [[':', 'before']] }], [{ u: [['::', 'before']] }])).toBe(false);
    expect(
      doqryEqual(
        [{ u: [[':', 'host', [{ c: ['active'] }]]] }],
        [{ u: [[':', 'host', [{ c: ['active'] }]]] }],
      ),
    ).toBe(true);
    expect(
      doqryEqual(
        [{ u: [[':', 'host', [{ c: ['active'] }]]] }],
        [{ u: [[':', 'host', [{ c: ['inactive'] }]]] }],
      ),
    ).toBe(false);
  });
  it('compares qualifiers', () => {
    expect(doqryEqual([{ $: ['a'] }], [{ $: ['b'] }])).toBe(false);
    expect(doqryEqual([{ $: ['a'] }], [{ $: ['a', 'c'] }])).toBe(false);
    expect(doqryEqual([{ $: ['a'] }], [{ $: ['a'] }])).toBe(true);
    expect(doqryEqual([{ $: ['a'] }], [{ s: 'some' }])).toBe(false);
    expect(doqryEqual([{ s: 'some' }], [{ $: ['a'] }])).toBe(false);
  });
});
