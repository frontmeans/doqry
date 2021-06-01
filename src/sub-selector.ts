import { DoqryAttribute } from './attribute';
import { DoqryCombinator } from './combinator';
import { DoqryPureSelector } from './pure-selector';

/**
 * A sub-selector of {@link DoqrySelector structured CSS selector}.
 *
 * Can be one of:
 *
 * - [attribute selector],
 * - [pseudo-class], or
 * - [pseudo-element].
 *
 * [attribute selector]: https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
 * [pseudo-class]: https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
 * [pseudo-element]: https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
 */
export type DoqrySubSelector =
    | DoqryAttribute
    | DoqrySubSelector.Pseudo;

export namespace DoqrySubSelector {

  /**
   * Structured CSS pseudo-class or pseudo-element selector.
   *
   * This is a tuple containing:
   *
   * - a pseudo-prefix (i.e. `:` for pseudo-classes, or `::` for pseudo-elements),
   * - pseudo-class or pseudo-element name (e.g. `host`, or `visited`), and
   * - optional parameters (i.e. the parentheses content following the name).
   *
   * Multiple colon-separated parameters may be represented as tuples.
   */
  export type Pseudo =
      | readonly [PseudoPrefix, string, ...Parameter]
      | readonly [PseudoPrefix, string, ...Parameter[]];

  /**
   * Pseudo-class (`:`) or pseudo-element (`::`) prefix.
   */
  export type PseudoPrefix = ':' | '::';

  /**
   * Structured CSS sub-selector's parameter.
   *
   * This is a {@link DoqryPureSelector pure CSS selector} containing no qualifiers.
   *
   * Raw string parameter may be represented either by string, or by sub-selector part containing only `s` property.
   */
  export type Parameter = readonly (string | DoqryPureSelector.Part | DoqryCombinator)[];

}
