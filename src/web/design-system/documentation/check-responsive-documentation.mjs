import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const criticalRecipes = [
  'workbench-shell.md', 'engagement-header.md', 'phase-navigation.md', 'requirement-row.md',
  'raid-register.md', 'knowledge-result.md', 'document-section-editor.md', 'ai-generation-drawer.md',
  'approval-actions.md', 'decision-comparison.md', 'source-citations.md', 'adr-summary.md',
];
const narrowBehavior = /(^|\n)## .*responsive[\s\S]*?\b(mobile|narrow|below|width|viewport|stack|scroll|drawer|compact)\b/i;
const gaps = criticalRecipes.filter((doc) => !narrowBehavior.test(readFileSync(join(directory, doc), 'utf8')));

if (gaps.length) {
  console.error(`Critical recipes missing documented narrow-screen behavior:\n- ${gaps.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`All ${criticalRecipes.length} critical recipes document narrow-screen behavior.`);
}
