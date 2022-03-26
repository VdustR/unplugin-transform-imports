import { createUnplugin } from "unplugin";
import { resolve } from "path";
import * as minimatch from "minimatch";
import type { TransformImportsOptions } from "./type";
import transformImport from "./transformImports";
import type { SourceMap } from "rollup";

const defaultCwd = process.cwd();

const transformImports = createUnplugin(
  (
    {
      enforce,
      cwd = defaultCwd,
      modules = [],
      includes = ["**/*.{tsx,ts,jsx,js,mjs}"],
      excludes = ["node_modules"],
      parseOptions,
      transformOptions,
    }: TransformImportsOptions = {
      modules: [],
    }
  ) => {
    const includesPatterns = includes.map((pattern) =>
      minimatch.makeRe(resolve(cwd, pattern))
    );
    const excludesPatterns = excludes.map((pattern) =>
      minimatch.makeRe(resolve(cwd, pattern))
    );
    return {
      name: "transform-import",
      modules,
      enforce,
      transformInclude(id) {
        return (
          includesPatterns.some((pattern) => pattern.test(id)) &&
          !excludesPatterns.some((pattern) => pattern.test(id))
        );
      },
      async transform(code) {
        const babelFileResult = await transformImport(code, {
          parseOptions,
          transformOptions,
          modules,
        });
        return {
          code: babelFileResult?.code || "",
          map: babelFileResult?.map as SourceMap,
        };
      },
    };
  }
);

export default transformImports;
