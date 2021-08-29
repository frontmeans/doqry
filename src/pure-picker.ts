import { QualifiedName } from '@frontmeans/namespace-aliaser';
import { DoqryCombinator } from './combinator';
import { DoqryPureSelector } from './pure-selector';
import { DoqrySubPicker } from './sub-picker';

/**
 * Pure CSS picker is a {@link DoqryPureSelector pure CSS selector} in normalized form.
 *
 * This is an array of pure picker {@link DoqryPureSelector.Part parts} and {@link DoqryCombinator combinators} between
 * them. Combinators do not follow each other. The last item is never a combinator.
 *
 * A picker never contains empty parts.
 */
export type DoqryPurePicker = readonly (DoqryPurePicker.Part | DoqryCombinator)[];

export namespace DoqryPurePicker {

  /**
   * A part of the {@link DoqryPurePicker pure CSS picker}.
   *
   * It is a {@link DoqryPureSelector.Part pure CSS selector part} that:
   *
   * - does not contain empty properties,
   * - does not contain unnecessary `*` element,
   * - does not contain empty class names,
   * - does not contain empty class names array,
   * - has class names sorted,
   * - does not contain empty sub-selectors array,
   * - contains normalized sub-pickers.
   *
   * This is the base of the {@link DoqryPicker.Part CSS picker part}. In contrast to the latter it does not support
   * qualifiers.
   */
  export interface Part extends DoqryPureSelector.Part {

    /**
     * Array of element class names.
     *
     * Either absent, or non-empty and containing non-empty class names sorted alphabetically.
     */
    readonly c?: readonly [QualifiedName, ...QualifiedName[]] | undefined;

    /**
     * Array of sub-pickers, each of which represents either attribute selector, pseudo-class, or pseudo-element.
     *
     * Either absent or non-empty.
     */
    readonly u?: readonly [DoqrySubPicker, ...DoqrySubPicker[]] | undefined;

  }

}
