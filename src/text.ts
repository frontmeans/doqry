import { NamespaceAliaser } from '@frontmeans/namespace-aliaser';
import { doqryPicker } from './picker';
import { DoqryPureSelector } from './pure-selector';
import { DoqrySelector } from './selector';
import { DoqryPicker$format } from './text.impl';

/**
 * Structured CSS selector textual format.
 */
export interface DoqryFormat {

  /**
   * Qualifier formatting function. When present, it is called for each qualifier to build its
   * textual representation. When unspecified, the qualifiers won't be attached to resulting CSS selector text.
   *
   * @param qualifier - Qualifier to format.
   *
   * @returns Textual representation of `qualifier`.
   */
  qualify?: ((this: void, qualifier: string) => string) | undefined;

  /**
   * Namespace aliaser to use.
   *
   * New instance will be created if not specified.
   */
  nsAlias?: NamespaceAliaser | undefined;

}

/**
 * Converts structured CSS selector to its textual representation.
 *
 * @param selector - Target CSS selector.
 * @param format - CSS selector format.
 *
 * @returns CSS selector string.
 */
export function doqryText(selector: DoqrySelector | DoqryPureSelector, format?: DoqryFormat): string {
  return DoqryPicker$format(doqryPicker(selector), format);
}
