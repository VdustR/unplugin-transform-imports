import parser from "@babel/parser";
import type { ParserOptions } from "@babel/parser";
import traverse from "@babel/traverse";
import { transformFromAstAsync, types as t } from "@babel/core";
import type { TransformOptions } from "@babel/core";
import type { Module } from "./type";
import type {
  Identifier,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  StringLiteral,
} from "@babel/types";

function isIdentifier(node: Identifier | StringLiteral): node is Identifier {
  return node.type === "Identifier";
}

export type ImportsTransformOptions = {
  parseOptions?: ParserOptions | undefined;
  transformOptions?: TransformOptions | undefined;
  modules: Module[];
};

export function groupImportSpecifier(
  specifiers: (
    | ImportDefaultSpecifier
    | ImportNamespaceSpecifier
    | ImportSpecifier
  )[]
): {
  importDefaultSpecifiers: ImportDefaultSpecifier[];
  importNamespaceSpecifiers: ImportNamespaceSpecifier[];
  importSpecifiers: ImportSpecifier[];
} {
  const importDefaultSpecifiers: ImportDefaultSpecifier[] = [];
  const importNamespaceSpecifiers: ImportNamespaceSpecifier[] = [];
  const importSpecifiers: ImportSpecifier[] = [];
  specifiers.forEach((specifier) => {
    if (specifier.type === "ImportDefaultSpecifier") {
      importDefaultSpecifiers.push(specifier);
    } else if (specifier.type === "ImportNamespaceSpecifier") {
      importNamespaceSpecifiers.push(specifier);
    } else {
      importSpecifiers.push(specifier);
    }
  });
  return {
    importDefaultSpecifiers,
    importNamespaceSpecifiers,
    importSpecifiers,
  };
}

export default async function importsTransform(
  code: string,
  { parseOptions, transformOptions, modules }: ImportsTransformOptions = {
    modules: [],
  }
) {
  const ast = parser.parse(code, { sourceType: "module", ...parseOptions });
  traverse(ast, {
    ImportDeclaration(path) {
      const moduleName = path.node.source.value;
      if (!moduleName) return;
      const matchedModule = modules.find((m) => m.path === moduleName);
      if (!matchedModule) return;
      if (!path.node.specifiers) return;
      const {
        importDefaultSpecifiers,
        importNamespaceSpecifiers,
        importSpecifiers,
      } = groupImportSpecifier(path.node.specifiers);
      // import * as xxx from "xxx";
      if (importNamespaceSpecifiers.length) return;
      // import xxx from "xxx";
      if (importSpecifiers.length === 0) return;
      const importDeclarations: ImportDeclaration[] = [];
      importDefaultSpecifiers.forEach((specifier) => {
        importDeclarations.push(
          t.importDeclaration([specifier], t.stringLiteral(moduleName))
        );
      });
      importSpecifiers.forEach((specifier) => {
        const [importName, constName] = [
          isIdentifier(specifier.imported)
            ? specifier.imported.name
            : specifier.imported.value,
          specifier.local.name,
        ] as [string, string];
        const transform = matchedModule.transform;
        const newModuleName = !transform
          ? `${moduleName}/${importName}`
          : typeof transform === "string"
          ? transform
              .replaceAll("${importName}", importName)
              .replaceAll("${moduleName}", moduleName)
              .replaceAll("${constName}", constName || importName)
          : transform(importName, moduleName, constName);
        importDeclarations.push(
          t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(constName))],
            t.stringLiteral(newModuleName)
          )
        );
      });
      path.replaceWithMultiple(importDeclarations);
    },
  });
  return transformFromAstAsync(ast, code, {
    babelrc: false,
    ...transformOptions,
  });
}
