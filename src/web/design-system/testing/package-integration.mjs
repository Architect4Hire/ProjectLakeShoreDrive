import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const artifactRoot = join(root, 'artifacts');
const packageName = 'project-lake-shore-drive-design-system';
const payloadRoot = join(artifactRoot, packageName);
const archivePath = join(artifactRoot, `${packageName}.tar.gz`);
const manifest = JSON.parse(readFileSync(join(root, 'src/web/design-system/integration-manifest.json'), 'utf8'));

for (const path of [payloadRoot, archivePath, `${archivePath}.sha256`, `${archivePath}.tree.txt`, `${archivePath}.source-revision.txt`, `${archivePath}.dependencies.json`]) {
  rmSync(path, { recursive: true, force: true });
}
mkdirSync(payloadRoot, { recursive: true });

const normalized = (path) => path.split(sep).join('/');
const hidden = (path) => normalized(path).split('/').some((part) => part.startsWith('.'));
const excluded = (path) => {
  const value = normalized(path);
  if (hidden(value)) return true;
  if (['node_modules', 'dist', 'test-results', 'playwright-report', 'results', '.cache'].some((part) => value.split('/').includes(part))) return true;
  return [...manifest.copy.exclude, ...manifest.testSupport.exclude].some((pattern) => {
    if (pattern.endsWith('/**/*.visual.spec.ts')) {
      const prefix = pattern.slice(0, -'/**/*.visual.spec.ts'.length);
      return value.startsWith(`${prefix}/`) && value.endsWith('.visual.spec.ts');
    }
    if (pattern.endsWith('/**/*.spec.ts')) {
      const prefix = pattern.slice(0, -'/**/*.spec.ts'.length);
      return value.startsWith(`${prefix}/`) && value.endsWith('.spec.ts');
    }
    return value === pattern || value.startsWith(`${pattern}/`);
  });
};
const copy = (source) => {
  const destination = join(payloadRoot, source);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(join(root, source), destination, {
    recursive: true,
    filter: (candidate) => !excluded(relative(root, candidate))
  });
};

for (const source of [...manifest.copy.files, ...manifest.copy.directories, ...manifest.copy.legalFiles]) copy(source);
for (const source of [...manifest.testSupport.copyDirectories, ...manifest.testSupport.copyFiles, ...manifest.testSupport.boundaryScripts]) copy(source);
for (const file of manifest.configuration.createFiles) {
  const destination = join(payloadRoot, file.path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, file.content);
}

const pruneEmpty = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) pruneEmpty(join(directory, entry.name));
  }
  if (directory !== payloadRoot && readdirSync(directory).length === 0) rmSync(directory, { recursive: true });
};
pruneEmpty(payloadRoot);

const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});
const files = walk(payloadRoot).sort();
const forbidden = files.filter((path) => excluded(relative(payloadRoot, path)) || ['node_modules', '.git', 'dist'].some((part) => normalized(relative(payloadRoot, path)).split('/').includes(part)));
if (forbidden.length) throw new Error(`Forbidden package content:\n${forbidden.join('\n')}`);

const sourceHash = createHash('sha256');
for (const file of files) {
  const path = normalized(relative(payloadRoot, file));
  sourceHash.update(`${path}\0`);
  sourceHash.update(readFileSync(file));
  sourceHash.update('\0');
}
const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
if (head.status !== 0) throw new Error(head.stderr || 'Unable to read Git revision');
const revision = head.stdout.trim();

const treeLines = [];
const tree = (directory) => {
  const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const path = join(directory, entry.name);
    const value = normalized(relative(payloadRoot, path));
    treeLines.push(entry.isDirectory() ? `${value}/` : value);
    if (entry.isDirectory()) tree(path);
  }
};
tree(payloadRoot);
writeFileSync(`${archivePath}.tree.txt`, `${treeLines.join('\n')}\n`);
writeFileSync(`${archivePath}.source-revision.txt`, `gitCommit=${revision}\npayloadTreeSha256=${sourceHash.digest('hex')}\nsourceWorktree=includes uncommitted transformed source listed by payload checksum\n`);
writeFileSync(`${archivePath}.dependencies.json`, `${JSON.stringify(manifest.dependencies, null, 2)}\n`);

const tar = spawnSync('tar', ['-czf', archivePath, '-C', artifactRoot, packageName], { cwd: root, encoding: 'utf8' });
if (tar.status !== 0) throw new Error(tar.stderr || 'Unable to create archive');
const archiveHash = createHash('sha256').update(readFileSync(archivePath)).digest('hex');
writeFileSync(`${archivePath}.sha256`, `${archiveHash}  ${basename(archivePath)}\n`);

console.log(`Packaged ${files.length} files at ${relative(root, payloadRoot)}`);
console.log(`Source revision: ${revision}`);
console.log(`Payload tree SHA-256: ${readFileSync(`${archivePath}.source-revision.txt`, 'utf8').split('\n')[1].split('=')[1]}`);
console.log(`Archive SHA-256: ${archiveHash}`);
