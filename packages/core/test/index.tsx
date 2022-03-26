// @ts-ignore
import { foo, foo1Ex as foo1, foo2 } from "foo";
// @ts-ignore
import { bar, bar1Ex as bar1, bar2 } from "@bar/core";

import // tailing comment
quxDefault, {
  baz,
  baz1Ex as baz1,
  baz2,
  // @ts-ignore
} from "baz";
import {
  /* inline comment */ default /* inline comment */ as /* inline comment */ qux /* inline comment */, // tailing comment
  /* inline comment */ qux1Ex /* inline comment */ as /* inline comment */ qux1 /* inline comment */, // tailing comment
  qux2,
  // @ts-ignore
} from /* inline comment */ "@qux/core";
// @ts-ignore
import * as quxAll from "@qux/core";
import {
  /* inline comment */
  /* inline comment */ default /* inline comment */ as /* inline comment */ quux, // tailing comment
  /* inline comment */
  quux1Ex as quux1,
  quux2,
  // @ts-ignore
} from "quux";
// @ts-ignore
import { corge, corge1Ex as corge1, corge2 } from "@corge/react";
// @ts-ignore
import { grault, grault1Ex as grault1, grault2 } from "grault-vue";

const str = "str" as const;
const component = <div />;

console.log({
  foo,
  foo1,
  foo2,
  bar,
  bar1,
  bar2,
  baz,
  baz1,
  baz2,
  quxDefault,
  qux,
  qux1,
  qux2,
  quxAll,
  quux,
  quux1,
  quux2,
  corge,
  corge1,
  corge2,
  grault,
  grault1,
  grault2,
  str,
  component,
});
