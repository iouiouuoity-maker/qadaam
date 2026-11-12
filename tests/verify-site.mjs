import { access, readFile, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const root = resolve(import.meta.dirname, '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const exists = async path => { try { await access(path, constants.R_OK); return true; } catch { return false; } };

const required = [
  'index.html', 'tasks.html', 'courses.html', 'challenge.html', 'journal.html', 'mentor.html',
  'styles.css', 'js/questions-part-1.js', 'js/questions-part-8.js', 'js/data.js', 'js/config.js', 'js/ai.js', 'js/app.js',
  'data/questions-part-1.json', 'data/questions-part-8.json', 'assets/qadam-cover.png', 'qadam-ai-worker/src/index.js',
  'qadam-ai-worker/wrangler.jsonc', 'GITHUB-UPLOAD.md', 'INTEGRATIONS.md'
];
for (const file of required) assert(await exists(resolve(root, file)), `Missing required file: ${file}`);

const htmlFiles = (await readdir(root)).filter(name => name.endsWith('.html'));
assert(htmlFiles.length === 14, `Expected 14 HTML pages, received ${htmlFiles.length}`);
for (const file of htmlFiles) {
  const html = await readFile(resolve(root, file), 'utf8');
  const order = [...Array.from({length:8},(_,index)=>`js/questions-part-${index+1}.js`), 'js/data.js', 'js/config.js', 'js/ai.js', 'js/app.js'].map(item => html.indexOf(item));
  assert(order.every(index => index >= 0), `${file}: one or more required scripts are missing`);
  assert(order.every((index, position) => position === 0 || index > order[position - 1]), `${file}: scripts are in the wrong order`);
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|#)/.test(link)) continue;
    const local = link.split(/[?#]/)[0];
    if (!local || !/\.(?:html|css|js|png|jpg|jpeg|svg|webp)$/i.test(local)) continue;
    assert(await exists(resolve(root, local)), `${file}: broken local reference ${link}`);
  }
}

for (const file of [...Array.from({length:8},(_,index)=>`js/questions-part-${index+1}.js`), 'js/data.js', 'js/config.js', 'js/ai.js', 'js/app.js', 'qadam-ai-worker/src/index.js']) {
  const checked = spawnSync(process.execPath, ['--check', resolve(root, file)], { encoding: 'utf8' });
  assert(checked.status === 0, `${file}: JavaScript syntax error: ${checked.stderr.trim()}`);
}

const context = vm.createContext({ window: {} });
for (let index = 1; index <= 8; index += 1) {
  vm.runInContext(await readFile(resolve(root, `js/questions-part-${index}.js`), 'utf8'), context);
}
vm.runInContext(await readFile(resolve(root, 'js/data.js'), 'utf8'), context);
assert(context.window.QADAM_DATA.tasks.length === 2400, 'Browser runtime did not load 2400 tasks');
assert(context.window.QADAM_DATA.topics.length === 6, 'Browser runtime did not load 6 topics');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`PASS site: ${htmlFiles.length} pages, local links, script order, JavaScript syntax, and browser dataset load verified.`);
