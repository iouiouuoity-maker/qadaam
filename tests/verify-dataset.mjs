import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const parts = await Promise.all(Array.from({ length: 8 }, (_, index) =>
  readFile(resolve(root, `data/questions-part-${index + 1}.json`), 'utf8').then(JSON.parse)
));
const tasks = parts.flat();
const topics = ['percent', 'fraction', 'whole', 'strategy', 'geometry', 'logic'];
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

function expected(task) {
  const p = task.meta.params;
  switch (task.meta.formula) {
    case 'percent-of': return p.whole * p.percent / 100;
    case 'percent-discount': return p.price * (100 - p.percent) / 100;
    case 'percent-reverse': return p.part * 100 / p.percent;
    case 'percent-successive': return p.base * (100 + p.increase) / 100 * (100 - p.decrease) / 100;
    case 'fraction-of': return p.whole / p.denominator * p.numerator;
    case 'fraction-remaining': return p.whole - p.whole / p.denominator * p.numerator;
    case 'fraction-sum': return p.whole / p.denominator * p.numerator + p.whole2 / p.denominator2 * p.numerator2;
    case 'fraction-reverse': return p.part / p.numerator * p.denominator;
    case 'whole-one-stage': return p.base * (p.denominator1 - p.numerator1) / p.denominator1;
    case 'whole-two-stage': return p.base * (p.denominator1 - p.numerator1) / p.denominator1 * (p.denominator2 - p.numerator2) / p.denominator2;
    case 'whole-reverse-two-stage': return p.final * p.denominator1 * p.denominator2 / ((p.denominator1 - p.numerator1) * (p.denominator2 - p.numerator2));
    case 'whole-two-stage-add': return p.base * (p.denominator1 - p.numerator1) / p.denominator1 * (p.denominator2 - p.numerator2) / p.denominator2 + p.added;
    case 'strategy-product': return p.left * p.right;
    case 'strategy-distributive': return p.factor * (p.addend1 + p.addend2);
    case 'strategy-mixed': return p.a * p.b + p.c * p.d;
    case 'strategy-equation': return (p.result - p.addend) / p.multiplier;
    case 'geometry-perimeter': return 2 * (p.length + p.width);
    case 'geometry-area': return p.length * p.width;
    case 'geometry-side': return p.area / p.length;
    case 'geometry-extended-area': return p.length * (p.width + p.extension);
    case 'logic-sequence': return p.start + 4 * p.difference;
    case 'logic-equation': return (p.result - p.addend) / p.multiplier;
    case 'logic-heads-legs': return (p.legs - p.heads * 2) / 2;
    case 'logic-coins': return (p.total - p.count * p.lowValue) / (p.highValue - p.lowValue);
    default: throw new Error(`Unknown formula: ${task.meta.formula}`);
  }
}

assert(tasks.length === 2400, `Expected 2400 tasks, received ${tasks.length}`);
assert(new Set(tasks.map(task => task.id)).size === tasks.length, 'Task IDs are not unique');
assert(new Set(tasks.map(task => task.q)).size === tasks.length, 'Question texts are not unique');

for (const task of tasks) {
  assert([5, 6].includes(task.grade), `${task.id}: invalid grade`);
  assert(topics.includes(task.topic), `${task.id}: invalid topic`);
  assert([1, 2, 3, 4].includes(task.level), `${task.id}: invalid level`);
  assert(task.type === 'number', `${task.id}: unsupported task type`);
  assert(typeof task.q === 'string' && task.q.length > 10, `${task.id}: missing question`);
  assert(typeof task.hint === 'string' && task.hint.length > 5, `${task.id}: missing hint`);
  assert(typeof task.solution === 'string' && task.solution.length > 5, `${task.id}: missing solution`);
  assert(Number.isFinite(task.answer), `${task.id}: answer is not finite`);
  assert(task.a === task.answer, `${task.id}: runtime and public answers differ`);
  assert(expected(task) === task.answer, `${task.id}: expected ${expected(task)}, stored ${task.answer}`);
}

for (const grade of [5, 6]) {
  assert(tasks.filter(task => task.grade === grade).length === 1200, `Grade ${grade} must have 1200 tasks`);
  for (const topic of topics) {
    assert(tasks.filter(task => task.grade === grade && task.topic === topic).length === 200, `Grade ${grade}/${topic} must have 200 tasks`);
    for (const level of [1, 2, 3, 4]) {
      const count = tasks.filter(task => task.grade === grade && task.topic === topic && task.level === level).length;
      assert(count === 50, `Grade ${grade}/${topic}/level ${level} has ${count}, expected 50`);
    }
  }
}

if (failures.length) {
  console.error(failures.slice(0, 50).join('\n'));
  process.exit(1);
}
console.log('PASS dataset: 2400 unique questions; all answers recomputed; 50 questions in every grade/topic/level cell.');
