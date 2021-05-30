import { DEFAULT__NS, NamespaceDef } from '@frontmeans/namespace-aliaser';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { doqryDisplayText, doqryText } from './text';

describe('doqryText', () => {

  let ns: NamespaceDef;

  beforeEach(() => {
    ns = new NamespaceDef('test/url', 'test');
  });

  it('formats raw selector', () => {
    expect(doqryText('.some')).toBe('.some');
  });
  it('formats element name', () => {
    expect(doqryText({ e: 'span' })).toBe('span');
  });
  it('formats element name from namespace', () => {
    expect(doqryText({ e: ['span', ns] })).toBe('test-span');
  });
  it('formats namespace', () => {
    expect(doqryText({ ns: 'foo', e: 'bar' })).toBe('foo|bar');
  });
  it('formats qualified namespace', () => {
    expect(doqryText({ ns, e: 'bar' })).toBe('test|bar');
  });
  it('formats default namespace', () => {
    expect(doqryText({ ns: DEFAULT__NS, e: 'bar' })).toBe('bar');
  });
  it('formats generic element', () => {
    expect(doqryText({ $: 'foo' })).toBe('*');
  });
  it('formats generic namespaced element', () => {
    expect(doqryText({ ns: 'foo' })).toBe('foo|*');
  });
  it('formats generic element in qualified namespace', () => {
    expect(doqryText({ ns })).toBe('test|*');
  });
  it('formats generic element in default namespace', () => {
    expect(doqryText({ ns: DEFAULT__NS })).toBe('*');
  });
  it('formats identifier', () => {
    expect(doqryText({ i: 'foo:bar' })).toBe('#foo\\:bar');
  });
  it('formats identifier in default namespace', () => {
    expect(doqryText({ i: ['foo:bar', DEFAULT__NS] })).toBe('#foo\\:bar');
  });
  it('formats identifier from namespace', () => {
    expect(doqryText({ i: ['foo:bar', ns] })).toBe('#test\\:foo\\:bar');
  });
  it('formats classes', () => {
    expect(doqryText({ c: ['foo', 'bar.baz'] })).toBe('.bar\\.baz.foo');
  });
  it('formats classes from namespace', () => {
    expect(doqryText({ c: ['foo', ['bar', ns]] })).toBe('.foo.bar\\@test');
  });
  it('formats attribute', () => {
    expect(doqryText({ u: ['attr'] })).toBe('[attr]');
  });
  it('escapes attribute name', () => {
    expect(doqryText({ u: ['test:attr'] })).toBe('[test\\:attr]');
  });
  it('escapes attribute value', () => {
    expect(doqryText({ u: ['attr', '=', '"value"', 'i'] })).toBe('[attr="\\"value\\"" i]');
  });
  it('formats pseudo-element', () => {
    expect(doqryText({ e: '*', u: ['::', 'visited'] })).toBe('*::visited');
  });
  it('formats pseudo-class with parameters', () => {
    expect(doqryText({
      u: [
        ':',
        'is',
        [{ c: 'custom' }],
        [{ c: 'other' }],
      ],
    })).toBe(':is(.custom,.other)');
  });
  it('formats sub-selectors', () => {
    expect(doqryText({ u: [['attr'], ['::', 'after']] })).toBe('[attr]::after');
  });
  it('formats selector suffix', () => {
    expect(doqryText({ e: 'a', s: ':hover' })).toBe('a:hover');
  });
  it('formats combinations', () => {
    expect(doqryText([{ e: 'ul' }, '>', { e: 'a' }, '+', { e: 'span', s: ':after' }])).toBe('ul>a+span:after');
  });
  it('separates parts', () => {
    expect(doqryText([{ e: 'ul' }, { e: 'a' }, { e: 'span', s: ':after' }])).toBe('ul a span:after');
  });
  it('ignores qualifiers', () => {
    expect(doqryText({ e: 'span', $: 'foo' })).toBe('span');
  });
  it('formats qualifiers by second argument', () => {
    expect(doqryText({ e: 'span', $: ['foo', 'bar'] }, { qualify(q) { return `@${q}`; } })).toBe('span@bar@foo');
  });
});

describe('doqryDisplayText', () => {
  it('formats qualifiers', () => {
    expect(doqryDisplayText([{ e: 'span', $: ['foo:bar=baz'] }])).toBe('span@foo@foo:bar@foo:bar=baz');
  });
});
