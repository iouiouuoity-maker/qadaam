import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tasks = [];
const fmt = value => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

function add({ grade, topic, level, index, q, a, hint, ex, unit = '', formula, params }) {
  const id = `g${grade}-${topic}-l${level}-${String(index + 1).padStart(3, '0')}`;
  tasks.push({
    id,
    grade,
    topic,
    level,
    type: 'number',
    q,
    a,
    answer: a,
    hint,
    ex,
    solution: ex,
    unit,
    meta: { formula, params }
  });
}

function percentTask(grade, level, index) {
  const bias = grade === 5 ? 0 : 70;
  if (level === 1) {
    const percent = [10, 20, 25, 40, 50][index % 5];
    const whole = 20 * (20 + bias + index);
    const answer = whole * percent / 100;
    add({ grade, topic: 'percent', level, index,
      q: `${fmt(whole)} санының ${percent}%-ын тап.`, a: answer,
      hint: `${percent}% = ${percent}/100. Санды осы бөлшекке көбейт.`,
      ex: `${fmt(whole)} × ${percent} ÷ 100 = ${fmt(answer)}.`,
      formula: 'percent-of', params: { whole, percent } });
  } else if (level === 2) {
    const percent = [10, 15, 20, 25, 30][index % 5];
    const price = 200 * (20 + bias + index);
    const answer = price * (100 - percent) / 100;
    add({ grade, topic: 'percent', level, index,
      q: `${fmt(price)} теңгелік затқа ${percent}% жеңілдік жасалды. Жаңа бағасын тап.`, a: answer,
      hint: `Алдымен ${percent}% жеңілдіктің сомасын тап, содан кейін бастапқы бағадан азайт.`,
      ex: `${fmt(price)} × ${percent} ÷ 100 = ${fmt(price - answer)}; ${fmt(price)} − ${fmt(price - answer)} = ${fmt(answer)} теңге.`,
      unit: 'теңге', formula: 'percent-discount', params: { price, percent } });
  } else if (level === 3) {
    const percent = [10, 20, 25, 40, 50][index % 5];
    const whole = 20 * (35 + bias + index);
    const part = whole * percent / 100;
    add({ grade, topic: 'percent', level, index,
      q: `Белгісіз санның ${percent}%-ы ${fmt(part)}-ге тең. Белгісіз санды тап.`, a: whole,
      hint: `${percent}% белгілі болса, алдымен 1%-ын немесе 10%-ын анықта.`,
      ex: `${fmt(part)} × 100 ÷ ${percent} = ${fmt(whole)}.`,
      formula: 'percent-reverse', params: { part, percent } });
  } else {
    const increase = [10, 20, 25][index % 3];
    const decrease = [10, 20, 25][(index * 2 + 1) % 3];
    const base = 400 * (12 + bias + index);
    const raised = base * (100 + increase) / 100;
    const answer = raised * (100 - decrease) / 100;
    add({ grade, topic: 'percent', level, index,
      q: `${fmt(base)} теңге алдымен ${increase}% қымбаттап, кейін жаңа бағадан ${decrease}% арзандады. Соңғы бағаны тап.`, a: answer,
      hint: `Екінші пайыз бастапқы бағадан емес, ${increase}% өскен жаңа бағадан есептеледі.`,
      ex: `${fmt(base)} × ${(100 + increase)}/100 = ${fmt(raised)}; ${fmt(raised)} × ${(100 - decrease)}/100 = ${fmt(answer)} теңге.`,
      unit: 'теңге', formula: 'percent-successive', params: { base, increase, decrease } });
  }
}

function fractionTask(grade, level, index) {
  const bias = grade === 5 ? 0 : 60;
  const denominators = [2, 3, 4, 5, 6, 8, 10];
  const denominator = denominators[index % denominators.length];
  const numerator = 1 + ((index * 3 + level) % (denominator - 1));
  const factor = 12 + bias + index;
  const whole = denominator * factor;
  const part = numerator * factor;
  if (level === 1) {
    add({ grade, topic: 'fraction', level, index,
      q: `${fmt(whole)} санының ${numerator}/${denominator} бөлігін тап.`, a: part,
      hint: `Алдымен ${fmt(whole)} санын ${denominator}-ге бөл, кейін ${numerator}-ге көбейт.`,
      ex: `${fmt(whole)} ÷ ${denominator} × ${numerator} = ${fmt(part)}.`,
      formula: 'fraction-of', params: { whole, numerator, denominator } });
  } else if (level === 2) {
    const answer = whole - part;
    add({ grade, topic: 'fraction', level, index,
      q: `${fmt(whole)} кітаптың ${numerator}/${denominator} бөлігі оқылды. Оқылмаған кітап санын тап.`, a: answer,
      hint: `Оқылған бөлікті тауып, оны барлық кітап санынан азайт.`,
      ex: `${fmt(whole)} ÷ ${denominator} × ${numerator} = ${fmt(part)}; ${fmt(whole)} − ${fmt(part)} = ${fmt(answer)} кітап.`,
      unit: 'кітап', formula: 'fraction-remaining', params: { whole, numerator, denominator } });
  } else if (level === 3) {
    const denominator2 = [3, 4, 5, 6, 8][index % 5];
    const numerator2 = 1 + ((index * 2 + 1) % (denominator2 - 1));
    const whole2 = denominator2 * (18 + bias + index);
    const part2 = numerator2 * (18 + bias + index);
    const answer = part + part2;
    add({ grade, topic: 'fraction', level, index,
      q: `${fmt(whole)} санының ${numerator}/${denominator} бөлігі мен ${fmt(whole2)} санының ${numerator2}/${denominator2} бөлігінің қосындысын тап.`, a: answer,
      hint: `Әр бөлшекті өз бүтінінен жеке тап, содан кейін қос.`,
      ex: `${fmt(part)} + ${fmt(part2)} = ${fmt(answer)}.`,
      formula: 'fraction-sum', params: { whole, numerator, denominator, whole2, numerator2, denominator2 } });
  } else {
    add({ grade, topic: 'fraction', level, index,
      q: `Бір санның ${numerator}/${denominator} бөлігі ${fmt(part)}-ге тең. Бастапқы санды тап.`, a: whole,
      hint: `Алдымен бір үлестің мәнін тап: ${fmt(part)} ÷ ${numerator}.`,
      ex: `${fmt(part)} ÷ ${numerator} × ${denominator} = ${fmt(whole)}.`,
      formula: 'fraction-reverse', params: { part, numerator, denominator } });
  }
}

function wholeTask(grade, level, index) {
  const bias = grade === 5 ? 0 : 50;
  const denominator1 = [2, 3, 4, 5][index % 4];
  const numerator1 = 1 + ((index + 1) % (denominator1 - 1));
  const denominator2 = [2, 3, 4, 5][(index + 2) % 4];
  const numerator2 = 1;
  const base = denominator1 * denominator2 * (15 + bias + index);
  const afterFirst = base * (denominator1 - numerator1) / denominator1;
  const afterSecond = afterFirst * (denominator2 - numerator2) / denominator2;
  if (level === 1) {
    add({ grade, topic: 'whole', level, index,
      q: `${fmt(base)} заттың ${numerator1}/${denominator1} бөлігі алынды. Қанша зат қалды?`, a: afterFirst,
      hint: `Алынған бөлікті тауып, бастапқы саннан азайт.`,
      ex: `${fmt(base)} − ${fmt(base - afterFirst)} = ${fmt(afterFirst)}.`,
      formula: 'whole-one-stage', params: { base, numerator1, denominator1 } });
  } else if (level === 2) {
    add({ grade, topic: 'whole', level, index,
      q: `${fmt(base)} дәптердің ${numerator1}/${denominator1} бөлігі, кейін қалғанының ${numerator2}/${denominator2} бөлігі берілді. Неше дәптер қалды?`, a: afterSecond,
      hint: `Екінші бөлшектің бүтіні — бірінші әрекеттен кейінгі ${fmt(afterFirst)} саны.`,
      ex: `${fmt(base)} → ${fmt(afterFirst)} → ${fmt(afterSecond)} дәптер қалды.`,
      unit: 'дәптер', formula: 'whole-two-stage', params: { base, numerator1, denominator1, numerator2, denominator2 } });
  } else if (level === 3) {
    add({ grade, topic: 'whole', level, index,
      q: `Санның ${numerator1}/${denominator1} бөлігі, кейін қалғанының ${numerator2}/${denominator2} бөлігі алынды. Соңында ${fmt(afterSecond)} қалды. Бастапқы санды тап.`, a: base,
      hint: `Әр кезеңді кері ретпен қалпына келтір.`,
      ex: `Кері тексеру: ${fmt(base)} → ${fmt(afterFirst)} → ${fmt(afterSecond)}. Бастапқы сан ${fmt(base)}.`,
      formula: 'whole-reverse-two-stage', params: { final: afterSecond, numerator1, denominator1, numerator2, denominator2 } });
  } else {
    const added = 5 * (index + 3 + (grade - 5) * 20);
    const answer = afterSecond + added;
    add({ grade, topic: 'whole', level, index,
      q: `${fmt(base)} литр судың ${numerator1}/${denominator1} бөлігі, кейін қалғанының ${numerator2}/${denominator2} бөлігі жұмсалды да, ${fmt(added)} литр су қосылды. Соңында қанша су болды?`, a: answer,
      hint: `Екі азайтуды ретімен орындап, тек соңында қосылған суды қос.`,
      ex: `${fmt(base)} → ${fmt(afterFirst)} → ${fmt(afterSecond)}; ${fmt(afterSecond)} + ${fmt(added)} = ${fmt(answer)} литр.`,
      unit: 'л', formula: 'whole-two-stage-add', params: { base, numerator1, denominator1, numerator2, denominator2, added } });
  }
}

function strategyTask(grade, level, index) {
  const bias = grade === 5 ? 0 : 70;
  if (level === 1) {
    const left = 18 + bias + index;
    const right = [5, 10, 25, 50][index % 4];
    const answer = left * right;
    add({ grade, topic: 'strategy', level, index,
      q: `${fmt(left)} × ${right} өрнегінің мәнін тиімді тәсілмен тап.`, a: answer,
      hint: `${right}-ді 10, 100 немесе олардың жартысы арқылы өрнекте.`,
      ex: `${fmt(left)} × ${right} = ${fmt(answer)}.`,
      formula: 'strategy-product', params: { left, right } });
  } else if (level === 2) {
    const factor = 12 + bias + index;
    const addend1 = 7 + index % 9;
    const addend2 = 3 + index % 6;
    const answer = factor * (addend1 + addend2);
    add({ grade, topic: 'strategy', level, index,
      q: `${fmt(factor)} × ${addend1} + ${fmt(factor)} × ${addend2} өрнегінің мәнін тап.`, a: answer,
      hint: `Ортақ ${fmt(factor)} көбейткішін жақша сыртына шығар.`,
      ex: `${fmt(factor)} × (${addend1} + ${addend2}) = ${fmt(factor)} × ${addend1 + addend2} = ${fmt(answer)}.`,
      formula: 'strategy-distributive', params: { factor, addend1, addend2 } });
  } else if (level === 3) {
    const a = 20 + bias + index;
    const b = 4 + index % 7;
    const c = 10 + index % 13;
    const d = 3 + index % 5;
    const answer = a * b + c * d;
    add({ grade, topic: 'strategy', level, index,
      q: `${fmt(a)} × ${b} + ${c} × ${d} өрнегінің мәнін тап.`, a: answer,
      hint: `Алдымен екі көбейтіндіні жеке есепте, содан кейін қос.`,
      ex: `${fmt(a * b)} + ${fmt(c * d)} = ${fmt(answer)}.`,
      formula: 'strategy-mixed', params: { a, b, c, d } });
  } else {
    const answer = 15 + bias + index;
    const multiplier = 3 + index % 8;
    const addend = 7 + index % 17;
    const result = answer * multiplier + addend;
    add({ grade, topic: 'strategy', level, index,
      q: `${multiplier} × x + ${addend} = ${fmt(result)} теңдеуіндегі x-ті тап.`, a: answer,
      hint: `Алдымен ${addend}-ні азайт, кейін ${multiplier}-ге бөл.`,
      ex: `x = (${fmt(result)} − ${addend}) ÷ ${multiplier} = ${fmt(answer)}.`,
      formula: 'strategy-equation', params: { multiplier, addend, result } });
  }
}

function geometryTask(grade, level, index) {
  const bias = grade === 5 ? 0 : 35;
  const length = 8 + bias + index;
  const width = 3 + index % 17;
  if (level === 1) {
    const answer = 2 * (length + width);
    add({ grade, topic: 'geometry', level, index,
      q: `Ұзындығы ${fmt(length)} см, ені ${width} см тіктөртбұрыштың периметрін тап.`, a: answer,
      hint: `P = 2 × (a + b).`,
      ex: `2 × (${fmt(length)} + ${width}) = ${fmt(answer)} см.`,
      unit: 'см', formula: 'geometry-perimeter', params: { length, width } });
  } else if (level === 2) {
    const answer = length * width;
    add({ grade, topic: 'geometry', level, index,
      q: `Ұзындығы ${fmt(length)} см, ені ${width} см тіктөртбұрыштың ауданын тап.`, a: answer,
      hint: `S = a × b.`,
      ex: `${fmt(length)} × ${width} = ${fmt(answer)} см².`,
      unit: 'см²', formula: 'geometry-area', params: { length, width } });
  } else if (level === 3) {
    const area = length * width;
    add({ grade, topic: 'geometry', level, index,
      q: `Тіктөртбұрыштың ауданы ${fmt(area)} см², ұзындығы ${fmt(length)} см. Енін тап.`, a: width,
      hint: `Белгісіз қабырға = аудан ÷ белгілі қабырға.`,
      ex: `${fmt(area)} ÷ ${fmt(length)} = ${width} см.`,
      unit: 'см', formula: 'geometry-side', params: { area, length } });
  } else {
    const extension = 2 + index % 9;
    const answer = length * (width + extension);
    add({ grade, topic: 'geometry', level, index,
      q: `${fmt(length)} см × ${width} см тіктөртбұрыштың ені ${extension} см-ге ұлғайды. Жаңа ауданын тап.`, a: answer,
      hint: `Жаңа ен: ${width} + ${extension}. Содан кейін аудан формуласын қолдан.`,
      ex: `${fmt(length)} × (${width} + ${extension}) = ${fmt(answer)} см².`,
      unit: 'см²', formula: 'geometry-extended-area', params: { length, width, extension } });
  }
}

function logicTask(grade, level, index) {
  const bias = grade === 5 ? 0 : 40;
  if (level === 1) {
    const start = 2 + bias + index;
    const difference = 2 + index % 11;
    const answer = start + 4 * difference;
    const seq = [0, 1, 2, 3].map(n => start + n * difference).join(', ');
    add({ grade, topic: 'logic', level, index,
      q: `${seq}, … тізбегінде әр сан ${difference}-ге артады. Келесі санды тап.`, a: answer,
      hint: `Соңғы санға ${difference}-ні қос.`,
      ex: `${fmt(start + 3 * difference)} + ${difference} = ${fmt(answer)}.`,
      formula: 'logic-sequence', params: { start, difference } });
  } else if (level === 2) {
    const answer = 7 + bias + index;
    const multiplier = 2 + index % 7;
    const addend = 5 + index % 13;
    const result = answer * multiplier + addend;
    add({ grade, topic: 'logic', level, index,
      q: `Ойланған санды ${multiplier}-ге көбейтіп, ${addend} қосты. Нәтиже ${fmt(result)} болды. Ойланған санды тап.`, a: answer,
      hint: `Амалдарды кері ретпен орында.`,
      ex: `(${fmt(result)} − ${addend}) ÷ ${multiplier} = ${fmt(answer)}.`,
      formula: 'logic-equation', params: { multiplier, addend, result } });
  } else if (level === 3) {
    const rabbits = 3 + bias + index;
    const chickens = 8 + (index * 3) % 41;
    const heads = rabbits + chickens;
    const legs = rabbits * 4 + chickens * 2;
    add({ grade, topic: 'logic', level, index,
      q: `Қорада тауық пен қоян бар: барлығы ${fmt(heads)} бас және ${fmt(legs)} аяқ. Қоян санын тап.`, a: rabbits,
      hint: `Барлығын тауық деп алсаң, ${fmt(heads * 2)} аяқ болар еді. Артық аяқтарды 2-ге бөл.`,
      ex: `(${fmt(legs)} − ${fmt(heads * 2)}) ÷ 2 = ${fmt(rabbits)} қоян.`,
      unit: 'қоян', formula: 'logic-heads-legs', params: { heads, legs } });
  } else {
    const lowValue = grade === 5 ? 20 : 50;
    const highValue = grade === 5 ? 50 : 100;
    const highCount = 4 + index;
    const lowCount = 7 + (index * 2) % 37;
    const count = highCount + lowCount;
    const total = highCount * highValue + lowCount * lowValue;
    add({ grade, topic: 'logic', level, index,
      q: `Қорапта ${lowValue} және ${highValue} теңгелік ${fmt(count)} монета бар. Жалпы құны ${fmt(total)} теңге. ${highValue} теңгелік монета санын тап.`, a: highCount,
      hint: `Барлық монетаны ${lowValue} теңгелік деп алып, құн айырмасын пайдалан.`,
      ex: `(${fmt(total)} − ${fmt(count * lowValue)}) ÷ ${highValue - lowValue} = ${fmt(highCount)} монета.`,
      unit: 'монета', formula: 'logic-coins', params: { lowValue, highValue, count, total } });
  }
}

const generators = {
  percent: percentTask,
  fraction: fractionTask,
  whole: wholeTask,
  strategy: strategyTask,
  geometry: geometryTask,
  logic: logicTask
};

for (const grade of [5, 6]) {
  for (const [topic, generator] of Object.entries(generators)) {
    for (const level of [1, 2, 3, 4]) {
      for (let index = 0; index < 50; index += 1) generator(grade, level, index);
    }
  }
}

await mkdir(resolve(root, 'data'), { recursive: true });
await mkdir(resolve(root, 'js'), { recursive: true });
const json = JSON.stringify(tasks, null, 2);
await writeFile(resolve(root, 'data/questions.json'), `${json}\n`, 'utf8');
await writeFile(resolve(root, 'js/questions.js'), `/* Generated by tools/generate-questions.mjs. */\nwindow.QADAM_QUESTIONS = ${json};\n`, 'utf8');
const partSize = 300;
for (let offset = 0; offset < tasks.length; offset += partSize) {
  const partNumber = offset / partSize + 1;
  const partJson = JSON.stringify(tasks.slice(offset, offset + partSize), null, 2);
  await writeFile(resolve(root, `data/questions-part-${partNumber}.json`), `${partJson}\n`, 'utf8');
  const prefix = partNumber === 1
    ? 'window.QADAM_QUESTIONS = '
    : 'window.QADAM_QUESTIONS.push(...';
  const suffix = partNumber === 1 ? ';' : ');';
  await writeFile(resolve(root, `js/questions-part-${partNumber}.js`), `/* Generated part ${partNumber} of 8. */\n${prefix}${partJson}${suffix}\n`, 'utf8');
}
console.log(`Generated ${tasks.length} questions.`);
