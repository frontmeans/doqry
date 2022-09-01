import { DoqryAttribute } from './attribute';
import { DoqryCombinator } from './combinator';
import { DoqryPurePicker } from './pure-picker';
import { DoqrySubSelector } from './sub-selector';

/**
 * A sub-picker of {@link DoqryPicker CSS picker}.
 */
export type DoqrySubPicker = DoqryAttribute | DoqrySubPicker.Pseudo;

export namespace DoqrySubPicker {
  /**
   * Structured CSS pseudo-class or pseudo-element picker.
   *
   * Contains parameters represented as tuples, if any.
   */
  export type Pseudo = readonly [DoqrySubSelector.PseudoPrefix, string, ...Parameter[]];

  /**
   * Structured CSS sub-picker's parameter.
   *
   * This is a {@link DoqryPurePicker pure CSS picker} containing no qualifiers.
   *
   * Raw string parameter is represented by sub-selector part containing only `s` property.
   */
  export type Parameter = readonly (DoqryPurePicker.Part | DoqryCombinator)[];
}
