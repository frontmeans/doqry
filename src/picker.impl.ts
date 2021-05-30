import { compareNames, isQualifiedName, QualifiedName } from '@frontmeans/namespace-aliaser';
import { isArrayOfElements } from '@proc7ts/primitives';
import { flatMapIt } from '@proc7ts/push-iterator';
import { DoqryCombinator, isDoqryCombinator } from './combinator';
import { DoqryPicker } from './picker';
import { DoqryPurePicker } from './pure-picker';
import { DoqryPureSelector } from './pure-selector';
import { DoqrySelector } from './selector';
import { DoqrySubPicker } from './sub-picker';
import { DoqrySubSelector } from './sub-selector';

const DoqryPicker__symbol = (/*#__PURE__*/ Symbol('DoqryPicker'));

type DoqrySelector$Normalizable = DoqrySelector & {
  readonly [DoqryPicker__symbol]?: DoqryPicker;
};

class DoqryPicker$Mutable extends Array<DoqryPicker.Part | DoqryCombinator> {

  get [DoqryPicker__symbol](): this {
    return this;
  }

}

export function DoqrySelector$normalize(selector: DoqryPurePicker.Part): [DoqryPurePicker.Part];

export function DoqrySelector$normalize(selector: DoqryPicker.Part): [DoqryPicker.Part];

export function DoqrySelector$normalize(selector: DoqryPureSelector): DoqryPurePicker;

export function DoqrySelector$normalize(selector: DoqrySelector): DoqryPicker;

export function DoqrySelector$normalize(selector: DoqrySelector$Normalizable): DoqryPicker {

  const normalized = selector[DoqryPicker__symbol];

  if (normalized) {
    return normalized;
  }
  if (!isArrayOfElements(selector)) {
    return new DoqryPicker$Mutable(DoqrySelector$normalizeKey(selector));
  }

  const picker = new DoqryPicker$Mutable();

  let combinator: DoqryCombinator | undefined;

  for (const item of selector) {

    const prevCombinator = combinator;

    if (combinator) {
      picker.push(combinator);
      combinator = undefined;
    }

    let part: DoqryPicker.Part;

    if (isDoqryCombinator(item)) {
      combinator = item;
      if (!prevCombinator) {
        continue;
      }
      part = {};
    } else {
      part = DoqrySelector$normalizeKey(item);
    }

    picker.push(part);
  }
  if (combinator) {
    picker.push(combinator, {});
  }

  return picker;
}

function DoqrySelector$normalizeKey(key: DoqrySelector.Part | string): DoqryPicker.Part {
  if (typeof key === 'string') {
    if (!key) {
      return {};
    }
    return { s: key };
  }
  return DoqrySelector$Part$normalize(key);
}

export function DoqrySelector$Part$normalize(part: DoqrySelector.Part): DoqryPicker.Part {

  const ns = part.ns || undefined;
  const i = part.i || undefined;
  const c = DoqryClass$normalizeAll(part.c);
  const u = DoqrySubSelector$normalizeAll(part.u);

  return {
    ns,
    e: (part.e !== '*' || !ns && !i && !c && u && DoqrySubSelector$isPseudo(u[0])) && part.e || undefined,
    i,
    c,
    u,
    s: part.s || undefined,
    $: DoqryQualifier$normalizeAll(part.$),
  };
}

function DoqryClass$normalizeAll(
    classes: QualifiedName | readonly QualifiedName[] | undefined,
): readonly [QualifiedName, ...QualifiedName[]] | undefined {
  if (!classes) {
    return;
  }
  if (isQualifiedName(classes)) {
    return [classes];
  }

  const result = classes.filter(c => !!c);

  return result.length ? result.sort(compareNames) as [QualifiedName, ...QualifiedName[]] : undefined;
}

function DoqrySubSelector$normalizeAll(
    subs: DoqrySubSelector | readonly DoqrySubSelector[] | undefined,
): readonly [DoqrySubPicker, ...DoqrySubPicker[]] | undefined {
  if (!subs) {
    return;
  }
  if (/*#__INLINE__*/ isDoqrySubSelectorsArray(subs)) {

    const result = subs.map(DoqrySubSelector$normalize);

    return result.length ? result as [DoqrySubPicker, ...DoqrySubPicker[]] : undefined;
  }

  return [DoqrySubSelector$normalize(subs)];
}

function isDoqrySubSelectorsArray(
    subs: DoqrySubSelector | readonly DoqrySubSelector[],
): subs is readonly DoqrySubSelector[] {
  return typeof subs[0] !== 'string';
}

function DoqrySubSelector$normalize(sub: DoqrySubSelector): DoqrySubPicker {
  if (!DoqrySubSelector$isPseudo(sub)) {
    return sub;
  }
  if (sub.length < 3) {
    return sub as DoqrySubPicker;
  }

  const [prefix, name, ...params] = sub;

  if (/*#__INLINE__*/ isDoqrySubSelectorParametersArray(params)) {
    return [prefix, name, ...params.map(DoqrySelector$normalize)];
  }

  return [prefix, name, DoqrySelector$normalize(params)];
}

export function DoqrySubSelector$isPseudo(sub: DoqrySubPicker): sub is DoqrySubPicker.Pseudo;

export function DoqrySubSelector$isPseudo(sub: DoqrySubSelector): sub is DoqrySubSelector.Pseudo;

export function DoqrySubSelector$isPseudo(sub: DoqrySubSelector): sub is DoqrySubSelector.Pseudo {
  return sub.length > 1 && (sub[0] === ':' || sub[0] === '::');
}

function isDoqrySubSelectorParametersArray(
    param: DoqrySubSelector.Parameter | readonly DoqrySubSelector.Parameter[],
): param is readonly DoqrySubSelector.Parameter[] {
  return isArrayOfElements(param[0]);
}

function DoqryQualifier$normalizeAll(
    qualifiers: string | readonly string[] | undefined,
): readonly [string, ...string[]] | undefined {
  if (!qualifiers) {
    return;
  }

  if (!isArrayOfElements(qualifiers)) {
    qualifiers = [...DoqryQualifier$expose(qualifiers)];
  } else {
    qualifiers = [...new Set(flatMapIt(qualifiers, DoqryQualifier$expose))].sort();
  }

  return qualifiers.length ? qualifiers as [string, ...string[]] : undefined;
}

const DoqryQualifier$none$exposed: ReadonlySet<string> = (/*#__PURE__*/ new Set());

function DoqryQualifier$expose(qualifier: string): ReadonlySet<string> {
  if (!qualifier) {
    return DoqryQualifier$none$exposed;
  }

  const eqIdx = qualifier.indexOf('=');
  const name = eqIdx < 0 ? qualifier : qualifier.substring(0, eqIdx);
  const exposed = new Set<string>();
  let lastExposed: string | undefined;

  for (const part of name.split(':')) {
    if (lastExposed) {
      lastExposed += ':' + part;
    } else {
      lastExposed = part;
    }
    exposed.add(lastExposed);
  }
  if (eqIdx >= 0) {
    exposed.add(qualifier);
  }

  return exposed;
}
