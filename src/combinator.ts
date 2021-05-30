/**
 * CSS selector combinator. One of `'>'`, `'+'`, or `'~'`.
 *
 * A space combinator is represented by combinator absence.
 */
export type DoqryCombinator = '>' | '+' | '~';

/**
 * Checks whether the given value is a {@DoqryCombinator CSS selector combinator}.
 *
 * @param value - A value to check.
 *
 * @returns `true` if the value equals to `'>'`, `'+'`, or `'~'`. `false otherwise.
 */
export function isDoqryCombinator(value: unknown): value is DoqryCombinator {
  return value === '>' || value === '+' || value === '~';
}
