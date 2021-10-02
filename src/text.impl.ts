import { escapeCSS, escapeCSSVal } from '@frontmeans/httongue';
import {
  css__naming,
  html__naming,
  id__naming,
  NamespaceAliaser,
  NamespaceDef,
  newNamespaceAliaser,
} from '@frontmeans/namespace-aliaser';
import { isDoqryCombinator } from './combinator';
import { DoqryPicker } from './picker';
import { DoqrySubSelector$isPseudo } from './picker.impl';
import { DoqrySubPicker } from './sub-picker';
import { DoqryFormat } from './text';

const DoqryFormat$default: DoqryFormat = {};

export function DoqryPicker$format(
    selector: DoqryPicker,
    {
      qualify,
      nsAlias = newNamespaceAliaser(),
    }: DoqryFormat = DoqryFormat$default,
): string {

  const format: DoqryFormat$ForPart = { qualify, nsAlias };

  return selector.reduce(
      (result, item) => {
        if (isDoqryCombinator(item)) {
          return result + item;
        }
        if (result && !isDoqryCombinator(result[result.length - 1])) {
          result += ' ';
        }

        return result + DoqryPicker$Part$format(item, format);
      },
      '',
  );
}

interface DoqryFormat$ForPart extends DoqryFormat {
  nsAlias: NamespaceAliaser;
}

function DoqryPicker$Part$format(
    item: DoqryPicker.Part,
    {
      qualify,
      nsAlias,
    }: DoqryFormat$ForPart,
): string {

  const { ns, e, i, c, s, u, $ } = item;
  let hasProperties = false;
  let out = '';

  if (i) {
    hasProperties = true;
    out += `#${escapeCSS(id__naming.name(i, nsAlias))}`;
  }
  if (c) {
    hasProperties = true;
    out = c.reduce<string>(
        (result, className) => `${result}.${escapeCSS(css__naming.name(className, nsAlias))}`,
        out,
    );
  }
  if (u) {
    hasProperties = true;

    const subFormat: DoqryFormat$ForPart = { nsAlias };

    out = u.reduce(
        (result, sub) => DoqrySubPicker$format(result, sub, subFormat),
        out,
    );
  }
  if (s) {
    hasProperties = true;
    out += s;
  }
  if (qualify && $) {
    out = $.reduce((result, qualifier) => result + qualify(qualifier), out);
  }
  if (ns) {

    const alias = xmlNs(ns, nsAlias);

    if (alias) {
      out = `${alias}|${e || '*'}${out}`;
    } else {
      out = qualifyElement();
    }
  } else {
    out = qualifyElement();
  }

  return out;

  function qualifyElement(): string {
    if (hasProperties) {
      return `${e ? html__naming.name(e, nsAlias) : ''}${out}`;
    }

    return `${e ? html__naming.name(e, nsAlias) : '*'}${out}`;
  }
}

function DoqrySubPicker$format(
    out: string,
    sub: DoqrySubPicker,
    format: DoqryFormat$ForPart,
): string {
  if (DoqrySubSelector$isPseudo(sub)) {
    out += sub[0] + sub[1];

    const len = sub.length;

    if (len > 2) {
      out += '(' + DoqryPicker$format(sub[2], format);
      for (let i = 3; i < sub.length; ++i) {
        out += ',' + DoqryPicker$format(sub[i] as DoqrySubPicker.Parameter, format);
      }
      out += ')';
    }

    return out;
  }

  const [attrName, attrOp, attrVal, attrFlag] = sub;

  out += '[' + escapeCSS(attrName);
  if (attrOp) {
    out += `${attrOp}"${escapeCSSVal(attrVal!)}"`;
  }
  if (attrFlag) {
    out += ' ' + attrFlag;
  }

  return out + ']';
}

function xmlNs(ns: string | NamespaceDef, nsAlias: NamespaceAliaser): string | undefined {
  return typeof ns === 'string' ? ns : ns.url ? nsAlias(ns) : undefined;
}
