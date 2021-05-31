import { NamespaceDef } from '@frontmeans/namespace-aliaser';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { doqryPicker, doqryPickerPart } from './picker';

describe('doqryPicker', () => {

  let nsA: NamespaceDef;
  let nsB: NamespaceDef;

  beforeEach(() => {
    nsA = new NamespaceDef('test/A', 'A');
    nsB = new NamespaceDef('test/B', 'B');
  });

  it('converts string to raw selector', () => {
    expect(doqryPicker('abc')).toEqual([{ s: 'abc' }]);
  });
  it('handles empty string', () => {
    expect(doqryPicker('')).toEqual([{}]);
  });
  it('handles empty selector part', () => {
    expect(doqryPicker({})).toEqual([{}]);
  });
  it('handles raw selector', () => {
    expect(doqryPicker({ s: 'abc' })).toEqual([{ s: 'abc' }]);
  });
  it('handles empty raw selector', () => {
    expect(doqryPicker({ s: '' })).toEqual([{}]);
  });
  it('handles combinators', () => {
    expect(doqryPicker(['abc', '>', { e: 'def' }])).toEqual([{ s: 'abc' }, '>', { e: 'def' }]);
  });
  it('handles subsequent combinators', () => {
    expect(doqryPicker([
      'abc',
      '>',
      '+',
      '~',
      { e: 'def' },
    ])).toEqual([
      { s: 'abc' },
      '>',
      {},
      '+',
      {},
      '~',
      { e: 'def' },
    ]);
  });
  it('handles trailing combinators', () => {
    expect(doqryPicker(['abc', '>', '+'])).toEqual([{ s: 'abc' }, '>', {}, '+', {}]);
  });
  it('handles id', () => {
    expect(doqryPicker({ i: 'abc' })).toEqual([{ i: 'abc' }]);
  });
  it('handles empty id', () => {
    expect(doqryPicker({ i: '' })).toEqual([{}]);
  });
  it('handles element', () => {
    expect(doqryPicker({ e: 'span' })).toEqual([{ e: 'span' }]);
  });
  it('handles empty element', () => {
    expect(doqryPicker({ e: '' })).toEqual([{}]);
  });
  it('removes `*` element', () => {
    expect(doqryPicker({ e: '*' })).toEqual([{}]);
  });
  it('normalizes classes', () => {
    expect(doqryPicker({ c: 'abc' })).toEqual([{ c: ['abc'] }]);
  });
  it('removes empty class', () => {
    expect(doqryPicker({ e: 'span', c: '' })).toEqual([{ e: 'span' }]);
  });
  it('sorts classes', () => {
    expect(doqryPicker({ c: ['def', 'abc'] })).toEqual([{ c: ['abc', 'def'] }]);
  });
  it('sorts namespaced classes', () => {
    expect(doqryPicker({ c: [['def', nsA], ['abc', nsB]] })).toEqual([{ c: [['def', nsA], ['abc', nsB]] }]);
    expect(doqryPicker({ c: [['def', nsB], ['abc', nsA]] })).toEqual([{ c: [['abc', nsA], ['def', nsB]] }]);
    expect(doqryPicker({ c: [['def', nsA], ['abc', nsA]] })).toEqual([{ c: [['abc', nsA], ['def', nsA]] }]);
  });
  it('sorts namespaced and local classes', () => {
    expect(doqryPicker({ c: ['def', ['abc', nsB]] })).toEqual([{ c: ['def', ['abc', nsB]] }]);
    expect(doqryPicker({ c: [['def', nsA], 'abc'] })).toEqual([{ c: ['abc', ['def', nsA]] }]);
  });
  it('strips empty classes', () => {
    expect(doqryPicker({ c: ['', 'abc', ''] })).toEqual([{ c: ['abc'] }]);
  });
  it('removes empty classes', () => {
    expect(doqryPicker({ e: 'span', c: ['', ''] })).toEqual([{ e: 'span' }]);
  });
  it('normalizes attribute selector', () => {
    expect(doqryPicker({ u: ['attr'] })).toEqual([{ u: [['attr']] }]);
  });
  it('normalizes attribute selector with value', () => {
    expect(doqryPicker({ u: ['attr', '^=', 'prefix', 'i'] })).toEqual([{ u: [['attr', '^=', 'prefix', 'i']] }]);
  });
  it('normalizes pseudo-class', () => {
    expect(doqryPicker({ u: [':', 'host'] })).toEqual([{ u: [[':', 'host']] }]);
  });
  it('normalizes pseudo-element', () => {
    expect(doqryPicker({ e: 'a', u: ['::', 'before'] })).toEqual([{ e: 'a', u: [['::', 'before']] }]);
  });
  it('normalizes pseudo-class with raw parameter', () => {
    expect(doqryPicker({
      e: 'li', u: [':', 'nth-child', '2'],
    })).toEqual([
      {
        e: 'li',
        u: [
          [':', 'nth-child', [{ s: '2' }]],
        ],
      },
    ]);
  });
  it('normalizes pseudo-class with simple selector as parameter', () => {
    expect(doqryPicker({
      u: [':', 'is', { e: 'li', c: 'selected' }],
    })).toEqual([
      {
        u: [
          [':', 'is', [{ e: 'li', c: ['selected'] }]],
        ],
      },
    ]);
  });
  it('normalizes pseudo-class with compound selector as parameter', () => {
    expect(doqryPicker({
      u: [':', 'is', { e: 'ul' }, '>', { e: 'li', c: 'selected' }],
    })).toEqual([
      {
        u: [
          [':', 'is', [{ e: 'ul' }, '>', { e: 'li', c: ['selected'] }]],
        ],
      },
    ]);
  });
  it('normalizes pseudo-class with multiple parameters', () => {
    expect(doqryPicker({
      u: [
        ':',
        'is',
        [{ e: 'a', u: [':', 'active'] }],
        [{ e: 'a', u: [':', 'focus'] }],
      ],
    })).toEqual([
      {
        u: [
          [
            ':',
            'is',
            [{ e: 'a', u: [[':', 'active']] }],
            [{ e: 'a', u: [[':', 'focus']] }],
          ],
        ],
      },
    ]);
  });
  it('normalizes multiple sub-selectors', () => {
    expect(doqryPicker({
      e: 'a',
      u: [
        ['href'],
        [':', 'nth-child', '2'],
        ['::', 'before'],
      ],
    })).toEqual([{
      e: 'a',
      u: [
        ['href'],
        [':', 'nth-child', [{ s: '2' }]],
        ['::', 'before'],
      ],
    }]);
  });
  it('removes empty sub-selectors array', () => {
    expect(doqryPicker({ e: 'a', u: [] })).toEqual([{ e: 'a' }]);
  });
  it('handles suffix string', () => {
    expect(doqryPicker({ e: 'span', s: '[abc]' })).toEqual([{ e: 'span', s: '[abc]' }]);
  });
  it('removes empty suffix string', () => {
    expect(doqryPicker({ e: 'span', s: '' })).toEqual([{ e: 'span' }]);
  });
  it('retains `*` element if only sub-selectors present and the first one is pseudo', () => {
    expect(doqryPicker({ e: '*', u: [':', 'hover'] })).toEqual([{ e: '*', u: [[':', 'hover']] }]);
  });
  it('removes `*` element if only sub-selectors present and the first one is attribute selector', () => {
    expect(doqryPicker({ e: '*', u: ['disabled'] })).toEqual([{ u: [['disabled']] }]);
  });
  it('removes `*` element if first sub-selector is pseudo, but other selectors present', () => {
    expect(doqryPicker({ e: '*', c: 'hover', u: [':', 'hover'] })).toEqual([
      { c: ['hover'], u: [[':', 'hover']] },
    ]);
  });
  it('normalizes qualifiers', () => {
    expect(doqryPicker({ $: 'abc' })).toEqual([{ $: ['abc'] }]);
  });
  it('removes empty qualifier', () => {
    expect(doqryPicker({ e: 'span', $: '' })).toEqual([{ e: 'span' }]);
  });
  it('strips empty qualifiers', () => {
    expect(doqryPicker({ $: ['', 'abc'] })).toEqual([{ $: ['abc'] }]);
  });
  it('removes empty qualifiers', () => {
    expect(doqryPicker({ e: 'span', $: ['', ''] })).toEqual([{ e: 'span' }]);
  });
  it('sorts qualifiers', () => {
    expect(doqryPicker({ $: ['def', 'abc'] })).toEqual([{ $: ['abc', 'def'] }]);
  });
  it('exposes qualifiers', () => {
    expect(doqryPicker({ $: ['foo:def', 'foo:z', 'bar:abc=vvv:xxx'] })).toEqual([{
      $: [
        'bar',
        'bar:abc',
        'bar:abc=vvv:xxx',
        'foo',
        'foo:def',
        'foo:z',
      ],
    }]);
  });
  it('returns the picker itself', () => {

    const picker = doqryPicker(doqryPicker(['abc', '>', { e: 'def' }]));

    expect(doqryPicker(picker)).toBe(picker);
  });
  it('returns the simple picker itself', () => {

    const picker = doqryPicker('span');

    expect(doqryPicker(picker)).toBe(picker);
  });
});

describe('doqryPickerPart', () => {
  it('normalizes selector part', () => {
    expect(doqryPickerPart({
      e: 'li', u: [':', 'nth-child', '2'],
    })).toEqual({
      e: 'li',
      u: [
        [':', 'nth-child', [{ s: '2' }]],
      ],
    });
  });
});
