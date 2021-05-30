import { DoqryCombinator } from './combinator';
import { DoqryPureSelector } from './pure-selector';

/**
 * Structured CSS selector.
 *
 * Can be one of:
 *
 * - raw CSS selector text,
 * - CSS selector part, or
 * - an array consisting of strings, parts, and their combinators.
 *
 * A structured CSS selector can be {@link doqryPicker normalized} to transform it to {@link DoqryPicker CSS picker}.
 */
export type DoqrySelector =
    | string
    | DoqrySelector.Part
    | readonly (string | DoqrySelector.Part | DoqryCombinator)[];

export namespace DoqrySelector {

  /**
   * A part of {@link DoqrySelector structured CSS selector}}.
   *
   * It may represent a selector like `element-name#id.class1.classN[attr1][attr2]:pseudo-class::pseudo-element` with
   * any of sub-parts omitted. Attributes, pseudo-classes, and pseudo-elements are represented as sub-selectors.
   * A raw CSS selector can also be represented by this structure, but is never parsed.
   *
   * All of the properties are optional.
   */
  export interface Part extends DoqryPureSelector.Part {

    /**
     * Qualifier or qualifiers.
     *
     * Qualifiers are typically not rendered as CSS selector text, but rather used to distinguish between style rules.
     *
     * Qualifier may have a `name=value` form. The `name` part may be qualified by separating name parts with colons.
     *
     * Example: `foo:bar:baz=some value` matches `foo:bar:baz=some value`, `foo:bar:baz`, `foo:bar`, and `foo`.
     */
    readonly $?: string | readonly string[];

  }

}

