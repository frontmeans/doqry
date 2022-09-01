import { namesEqual, NamespaceDef, QualifiedName } from '@frontmeans/namespace-aliaser';
import { arraysAreEqual } from '@proc7ts/primitives';
import { DoqryCombinator } from './combinator';
import { doqryPicker, DoqryPicker } from './picker';
import { DoqrySubSelector$isPseudo } from './picker.impl';
import { DoqryPureSelector } from './pure-selector';
import { DoqrySelector } from './selector';
import { DoqrySubPicker } from './sub-picker';

/**
 * Tests whether two structured CSS selectors equal.
 *
 * @param first - First selector.
 * @param second - Second selector.
 *
 * @returns `true` if selectors are equal, `false` otherwise.
 */
export function doqryEqual(
  first: DoqrySelector | DoqryPureSelector,
  second: DoqrySelector | DoqryPureSelector,
): boolean {
  return arraysAreEqual(doqryPicker(first), doqryPicker(second), DoqryPicker$Part$equal);
}

function DoqryPicker$Part$equal(
  first: DoqryPicker.Part | DoqryCombinator,
  second: DoqryPicker.Part | DoqryCombinator,
): boolean {
  if (typeof first === 'string') {
    return first === second;
  }
  if (typeof second === 'string') {
    return false;
  }

  return (
    DoqryNamespace$equal(first.ns, second.ns)
    && DoqryName$equal(first.e, second.e)
    && DoqryName$equal(first.i, second.i)
    && DoqryClass$allEqual(first.c, second.c)
    && DoqrySubPicker$allEqual(first.u, second.u)
    && DoqryQualifier$allEqual(first.$, second.$)
  );
}

function DoqryNamespace$equal(
  first: string | NamespaceDef | undefined,
  second: string | NamespaceDef | undefined,
): boolean {
  if (!first || typeof first === 'string') {
    return first === second;
  }
  if (!second || typeof second === 'string') {
    return false;
  }

  return first.url === second.url;
}

function DoqryName$equal(
  first: QualifiedName | undefined,
  second: QualifiedName | undefined,
): boolean {
  return first == null ? second == null : second != null && namesEqual(first, second);
}

function DoqryClass$allEqual(
  first: readonly QualifiedName[] | undefined,
  second: readonly QualifiedName[] | undefined,
): boolean {
  if (!first) {
    return !second;
  }
  if (!second) {
    return false;
  }

  return arraysAreEqual(first, second, namesEqual);
}

function DoqrySubPicker$allEqual(
  first: readonly DoqrySubPicker[] | undefined,
  second: readonly DoqrySubPicker[] | undefined,
): boolean {
  if (!first) {
    return !second;
  }
  if (!second) {
    return false;
  }

  return arraysAreEqual(first, second, DoqrySubPicker$equal);
}

function DoqrySubPicker$equal(first: DoqrySubPicker, second: DoqrySubPicker): boolean {
  if (first.length !== second.length) {
    return false;
  }
  if (DoqrySubSelector$isPseudo(first)) {
    return first.every((p, i) => i < 2
        ? p === second[i]
        : doqryEqual(p as DoqrySubPicker.Parameter, second[i] as DoqrySubPicker.Parameter));
  }

  return first.every((str, i) => str === second[i]);
}

function DoqryQualifier$allEqual(
  first: readonly string[] | undefined,
  second: readonly string[] | undefined,
): boolean {
  if (!first) {
    return !second;
  }
  if (!second) {
    return false;
  }

  return arraysAreEqual(first, second);
}
