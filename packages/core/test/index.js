// @ts-ignore
import { foo, foo1Ex as foo1, foo2 } from "foo";
// @ts-ignore
import { bar, bar1Ex as bar1, bar2 } from "@bar/core";
// @ts-ignore
import { baz, baz1Ex as baz1, baz2 } from "baz";
// @ts-ignore
import { qux, qux1Ex as qux1, qux2 } from "@qux/core";
// @ts-ignore
import { quux, quux1Ex as quux1, quux2 } from "quux";
// @ts-ignore
import { corge, corge1Ex as corge1, corge2 } from "@corge/react";
// @ts-ignore
import { grault, grault1Ex as grault1, grault2 } from "grault-vue";

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
  qux,
  qux1,
  qux2,
  quux,
  quux1,
  quux2,
  corge,
  corge1,
  corge2,
  grault,
  grault1,
  grault2,
});
