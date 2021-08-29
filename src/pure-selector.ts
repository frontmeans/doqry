import { NamespaceDef, QualifiedName } from '@frontmeans/namespace-aliaser';
import { DoqryCombinator } from './combinator';
import { DoqrySubSelector } from './sub-selector';

/**
 * Pure CSS selector.
 *
 * Can be one of:
 *
 * - raw CSS selector text,
 * - CSS selector part, or
 * - an array consisting of strings, parts, and their combinators.
 *
 * A structured CSS selector can be {@link doqryPicker normalized} to transform it to {@link DoqryPurePicker pure CSS
 * picker}.
 *
 * This is the base of {@link DoqrySelector structured CSS selector}. In contrast to the latter it does not support
 * qualifiers.
 */
export type DoqryPureSelector =
    | string
    | DoqryPureSelector.Part
    | readonly (string | DoqryPureSelector.Part | DoqryCombinator)[];

export namespace DoqryPureSelector {

  /**
   * A part of pure CSS selector.
   *
   * It may represent a selector like `element-name#id.class1.classN[attr1][attr2]:pseudo-class::pseudo-element` with
   * any of sub-parts omitted. Attributes, pseudo-classes, and pseudo-elements are represented as sub-selectors.
   * A raw CSS selector can also be represented by this structure, but is never parsed.
   *
   * All of the properties are optional.
   *
   * This is the base of the {@link DoqryPicker.Part structured CSS selector part}. In contrast to the latter it does
   * not support qualifiers.
   */
  export interface Part {

    /**
     * Element namespace.
     */
    readonly ns?: string | NamespaceDef | undefined;

    /**
     * Element name.
     *
     * This is the same as `*` when absent. Unless the part contains only sub-selectors, and the first one is either
     * a pseudo-class or a pseudo-element.
     */
    readonly e?: QualifiedName | undefined;

    /**
     * Element identifier.
     */
    readonly i?: QualifiedName | undefined;

    /**
     * Element class name or names.
     */
    readonly c?: QualifiedName | readonly QualifiedName[] | undefined;

    /**
     * Sub-selector(s) representing either attribute selector, pseudo-class, or pseudo-element.
     */
    readonly u?: DoqrySubSelector | readonly DoqrySubSelector[] | undefined;

    /**
     * Raw CSS selector text to append to the end.
     *
     * When all other properties are omitted this one represents a raw CSS selector text. Otherwise it is appended
     * to other selector parts representation.
     */
    readonly s?: string | undefined;

  }

}
