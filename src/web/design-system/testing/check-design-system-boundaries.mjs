import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const defaultDesignSystemRoot = path.join(repositoryRoot, 'src/web/design-system');
const approvedPackages = [/^@angular\//, /^rxjs(?:\/|$)/];
const sourceExtensions = new Set(['.ts', '.css', '.html']);

function inside(file, root) {
  const relative = path.relative(path.resolve(root), path.resolve(file));
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function productionFiles(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(root, entry.name);
    const relative = path.relative(root, target).replaceAll(path.sep, '/');
    if (entry.isDirectory()) {
      if (/^(documentation|testing)(\/|$)/.test(relative)) return [];
      return productionFiles(target);
    }
    if (!sourceExtensions.has(path.extname(target))) return [];
    if (/\.(?:spec|visual\.spec)\.ts$/.test(target)) return [];
    return [target];
  });
}

function lineAt(source, offset) {
  return source.slice(0, offset).split(/\r?\n/).length;
}

function moduleSpecifiers(source, file) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const items = [];
  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      items.push({ specifier: node.moduleSpecifier.text, offset: node.moduleSpecifier.getStart(sourceFile) });
    }
    if (ts.isCallExpression(node) && node.arguments.length && ts.isStringLiteral(node.arguments[0]) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) {
      items.push({ specifier: node.arguments[0].text, offset: node.arguments[0].getStart(sourceFile) });
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return items;
}

function resolveRelative(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [base, `${base}.ts`, `${base}.js`, path.join(base, 'index.ts'), path.join(base, 'index.js')];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? base;
}

export function checkDesignSystemBoundaries({ designSystemRoot = defaultDesignSystemRoot } = {}) {
  const root = path.resolve(designSystemRoot);
  const tokenRoot = path.join(root, 'tokens');
  const violations = [];

  for (const file of productionFiles(root)) {
    const source = fs.readFileSync(file, 'utf8');
    if (path.extname(file) === '.ts') {
      for (const item of moduleSpecifiers(source, file)) {
        if (item.specifier.startsWith('.')) {
          const resolved = resolveRelative(file, item.specifier);
          if (!inside(resolved, root)) {
            violations.push({ file, line: lineAt(source, item.offset), rule: 'design-system-internal-dependency', message: `Relative dependency resolves outside the design-system boundary: "${item.specifier}".` });
          }
        } else if (!approvedPackages.some((pattern) => pattern.test(item.specifier))) {
          violations.push({ file, line: lineAt(source, item.offset), rule: 'design-system-approved-dependency', message: `Package or application alias is not approved for design-system code: "${item.specifier}".` });
        }
      }
    }

    if (!inside(file, tokenRoot)) {
      const rawColor = /(?<!&)#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\s*\(/g;
      const paletteUtility = /\b(?:bg|text|border|ring|outline)-(?:black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{2,3})?(?:\/\d+)?\b/g;
      for (const [rule, pattern] of [['semantic-color-literal', rawColor], ['semantic-color-utility', paletteUtility]]) {
        for (const match of source.matchAll(pattern)) {
          violations.push({ file, line: lineAt(source, match.index ?? 0), rule, message: `Use a semantic design token instead of "${match[0]}".` });
        }
      }
    }
  }
  return violations;
}

function runSelfTest() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'lsd-design-system-policy-'));
  try {
    const root = path.join(fixture, 'design-system');
    const component = path.join(root, 'components/example');
    const application = path.join(fixture, 'application');
    fs.mkdirSync(component, { recursive: true });
    fs.mkdirSync(path.join(root, 'tokens'), { recursive: true });
    fs.mkdirSync(application, { recursive: true });
    fs.writeFileSync(path.join(application, 'engagement.service.ts'), 'export class EngagementService {}\n');
    fs.writeFileSync(path.join(component, 'example.component.ts'), [
      "import { Component } from '@angular/core';",
      "import { EngagementService } from '../../../application/engagement.service';",
      "import { SessionService } from '@app/session.service';",
      '@Component({}) export class ExampleComponent {}',
    ].join('\n'));
    fs.writeFileSync(path.join(component, 'example.component.css'), '.example { color: #123456; background: rgb(0 0 0); }\n');
    fs.writeFileSync(path.join(component, 'example.component.html'), '<div class="bg-red-500 text-white">Example</div>\n');
    fs.writeFileSync(path.join(root, 'tokens/colors.ts'), "export const allowedPrimitive = '#123456';\n");

    const violations = checkDesignSystemBoundaries({ designSystemRoot: root });
    const expected = new Map([
      ['design-system-internal-dependency', 1], ['design-system-approved-dependency', 1],
      ['semantic-color-literal', 2], ['semantic-color-utility', 2],
    ]);
    for (const [rule, count] of expected) {
      const actual = violations.filter((item) => item.rule === rule).length;
      if (actual !== count) throw new Error(`${rule}: expected ${count} synthetic violations, received ${actual}.`);
    }
    console.log('Design-system self-test passed: escaping/application dependencies and raw semantic-color violations were detected.');
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--self-test')) runSelfTest();
  else {
    const violations = checkDesignSystemBoundaries();
    for (const violation of violations) console.error(`${path.relative(repositoryRoot, violation.file)}:${violation.line} [${violation.rule}] ${violation.message}`);
    if (violations.length) process.exitCode = 1;
    else console.log('Design-system dependency and semantic-token checks passed.');
  }
}
