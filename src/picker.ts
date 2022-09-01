import { DoqryCombinator } from './combinator';
import { DoqrySelector$normalize, DoqrySelector$Part$normalize } from './picker.impl';
import { DoqryPurePicker } from './pure-picker';
import { DoqryPureSelector } from './pure-selector';
import { DoqrySelector } from './selector';

/**
 * CSS picker is a {@link DoqrySelector structured CSS selector} in normalized form.
 *
 * This is an array of CSS picker {@link DoqryPicker.Part parts} and {@link DoqryCombinator combinators} between them.
 * Combinators do not follow each other. The last item is never a combinator.
 *
 * A picker never contains empty parts.
 */
export type DoqryPicker = readonly (DoqryPicker.Part | DoqryCombinator)[];

export namespace DoqryPicker {
  /**
   * Mutable {@link DoqryPicker CSS picker}.
   */
  export type Mutable = (Part | DoqryCombinator)[];

  /**
   * A part of the {@link DoqryPicker structured CSS picker}.
   *
   * It is a {@link DoqrySelector.Part structured CSS selector part} that:
   *
   * - does not contain empty properties,
   * - does not contain unnecessary `*` element,
   * - does not contain empty class names,
   * - does not contain empty class names array,
   * - has class names sorted,
   * - does not contain empty sub-selectors array,
   * - contains normalized sub-pickers.
   * - does not contain empty qualifiers,
   * - does not contain empty qualifiers array,
   * - has qualifiers exposed, e.g. `foo:bar=baz` is exposed as three qualifiers: `foo`, `foo:bar`, and `foo:bar=baz`
   * - has qualifiers sorted.
   */
  export interface Part extends DoqryPurePicker.Part {
    /**
     * Array of qualifiers.
     *
     * Either absent, or non-empty and containing non-empty qualifiers sorted alphabetically.
     */
    readonly $?: readonly [string, ...string[]] | undefined;
  }
}

/**
 * Converts a pure CSS picker part to pure CSS picker.
 *
 * @param part - Pure CSS picker part.
 *
 * @returns Pure CSS picker. An array containing a `part` as its only element.
 */
export function doqryPicker(part: DoqryPurePicker.Part): [DoqryPurePicker.Part];

/**
 * Converts CSS picker part to CSS picker.
 *
 * @param part - CSS picker part.
 *
 * @returns CSS picker. An array containing a `part` as its only item.
 */
export function doqryPicker(part: DoqryPicker.Part): [DoqryPicker.Part];

/**
 * Normalizes arbitrary pure CSS selector.
 *
 * @param selector - Pure CSS selector to normalize.
 *
 * @returns Pure CSS picker, or the `selector` itself if it normalized already.
 */
export function doqryPicker(selector: DoqryPureSelector): DoqryPurePicker;

/**
 * Normalizes arbitrary structured CSS selector.
 *
 * @param selector - CSS selector to normalize.
 *
 * @returns Normalized CSS picker, or the `selector` itself if normalized already.
 */
export function doqryPicker(selector: DoqrySelector): DoqryPicker;

export function doqryPicker(selector: DoqrySelector): DoqryPicker {
  return DoqrySelector$normalize(selector);
}

/**
 * Normalizes arbitrary part of structured CSS selector.
 *
 * @param part - CSS selector party to normalize.
 *
 * @returns Normalized CSS picker part.
 */
export function doqryPickerPart(part: DoqrySelector.Part): DoqryPicker.Part {
  return DoqrySelector$Part$normalize(part);
}
