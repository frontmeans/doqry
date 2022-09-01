/**
 * Structured CSS attribute selector.
 *
 * Can be one of:
 *
 * - an attribute name representing selector like `[attribute]`, or
 * - a tuple consisting of attribute name, operator, value, and optional flag representing selector like
 *   `[attribute^="value" i]`;
 */
export type DoqryAttribute =
  | readonly [string]
  | readonly [string, DoqryAttribute.Operator, string, DoqryAttribute.Flag?];

export namespace DoqryAttribute {
  /**
   * CSS attribute selector operator.
   */
  export type Operator = '=' | '~=' | '|=' | '^=' | '$=' | '*=';

  /**
   * CSS attribute selector flag.
   */
  export type Flag = 'i';
}
