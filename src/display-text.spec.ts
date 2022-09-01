import { describe, expect, it } from '@jest/globals';
import { doqryDisplayText } from './display-text';

describe('doqryDisplayText', () => {
  it('formats qualifiers', () => {
    expect(doqryDisplayText([{ e: 'span', $: ['foo:+bar=baz ban'] }])).toBe(
      'span$foo$foo:\\+bar$foo:\\+bar(baz ban)',
    );
  });
  it('formats `@`-prefixed qualifiers', () => {
    expect(doqryDisplayText([{ e: 'span', $: ['@foo:bar=baz'] }])).toBe(
      'span@foo@foo:bar@foo:bar(baz)',
    );
  });
});
