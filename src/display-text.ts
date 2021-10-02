import { escapeCSS, escapeCSSVal } from '@frontmeans/httongue';
import { doqryPicker } from './picker';
import { DoqrySelector } from './selector';
import { DoqryFormat } from './text';
import { DoqryPicker$format } from './text.impl';

const DoqryFormat$display: DoqryFormat = {
  qualify(qualifier: string) {

    const eqIdx = qualifier.indexOf('=');

    if (eqIdx < 0) {
      return DoqryQualifier$formatName(qualifier);
    }

    const name = DoqryQualifier$formatName(qualifier.substr(0, eqIdx));
    const value = escapeCSSVal(qualifier.substr(eqIdx + 1));

    return `${name}(${value})`;
  },
};

function DoqryQualifier$formatName(name: string): string {
  if (name[0] === '@') {
    return '@' + DoqryQualifier$formatRawName(name.substr(1));
  }

  return '$' + DoqryQualifier$formatRawName(name);
}

function DoqryQualifier$formatRawName(name: string): string {
  return name.split(':').map(escapeCSS).join(':');
}


/**
 * Converts structured CSS selector to its display textual representation including qualifiers.
 *
 * @param selector - Target CSS selector.
 *
 * @returns Selector string containing qualifiers.
 */
export function doqryDisplayText(selector: DoqrySelector): string {
  return DoqryPicker$format(doqryPicker(selector), DoqryFormat$display);
}
