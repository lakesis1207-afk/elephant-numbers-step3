// 바닷가 마을 게임 3종: 10 안 더하기·빼기와 식. 단계: 그림만(pic) → 그림과 식(both) → 식만(eq)
import { pickNumber, randInt, nearChoices, pickOne } from '@공통/games/logic.js';
import { makeChoiceGame, withDistractors } from '../choice.js';
import { pics, pair, bigText, column } from '../visuals.js';
import { josa, sayEq, cnt } from '../say.js';

// [가장 큰 수, 보여 주는 방식]
const MATH_LEVELS = [
  [5, 'pic'],
  [8, 'both'],
  [10, 'eq'],
];

/** 방식에 따라 그림·식을 고른다 */
const showBy = (mode, picture, equation) =>
  mode === 'pic' ? picture : mode === 'eq' ? bigText(equation) : column(picture, bigText(equation));

function addQuestion(max, last) {
  const sum = pickNumber(2, max, last);
  const a = randInt(1, sum - 1);
  return { a, b: sum - a, sum };
}

function subQuestion(max, last) {
  const left = pickNumber(1, max - 1, last);
  const b = randInt(1, max - left);
  return { total: left + b, b, left };
}

const addGame = makeChoiceGame({
  key: 'add',
  background: 'sea-base',
  levels: MATH_LEVELS,
  build({ range: [max, mode], last }) {
    const { a, b, sum } = addQuestion(max, last);
    return {
      answer: sum,
      options: nearChoices(sum, 1, 10),
      scene: showBy(mode, pair(pics(a, 'shell'), '+', pics(b, 'shell')), `${a} + ${b} = ?`),
      prompt:
        mode === 'eq'
          ? `${a} 더하기 ${b}${josa(b, '은', '는')} 얼마일까?`
          : `조개가 ${cnt(a)} 있었는데 ${cnt(b)}가 더 왔어. 모두 몇 개일까?`,
      hintText: `${sayEq(a, '더하기', b, sum)}!`,
    };
  },
});

const subGame = makeChoiceGame({
  key: 'sub',
  background: 'sea-base',
  levels: MATH_LEVELS,
  build({ range: [max, mode], last }) {
    const { total, b, left } = subQuestion(max, last);
    return {
      answer: left,
      options: nearChoices(left, 0, 10),
      scene: showBy(mode, pics(total, 'fish', b), `${total} − ${b} = ?`),
      prompt:
        mode === 'eq'
          ? `${total} 빼기 ${b}${josa(b, '은', '는')} 얼마일까?`
          : `물고기 ${cnt(total, '마리')} 중에 ${cnt(b, '마리')}가 헤엄쳐 갔어. 몇 마리 남았을까?`,
      hintText: `${sayEq(total, '빼기', b, left)}!`,
    };
  },
});

const eqGame = makeChoiceGame({
  key: 'eq',
  background: 'sea-base',
  wide: true,
  levels: [
    [6, 'add'],
    [10, 'add'],
    [10, 'mix'],
  ],
  build({ range: [max, kind] }) {
    const isSub = kind === 'mix' && pickOne([true, false]);
    if (isSub) {
      const { total, b, left } = subQuestion(max);
      const answer = `${total} − ${b} = ${left}`;
      return {
        answer,
        options: withDistractors(answer, [`${total} + ${b} = ${total + b}`, `${total} − ${b} = ${left + 1}`, `${total} − ${b} = ${left - 1}`]),
        scene: pics(total, 'fish', b),
        prompt: '그림에 맞는 식을 골라 봐!',
        hintText: `물고기 ${cnt(total, '마리')}에서 ${cnt(b, '마리')}가 가면 ${cnt(left, '마리')}가 남아!`,
      };
    }
    const { a, b, sum } = addQuestion(max);
    const answer = `${a} + ${b} = ${sum}`;
    const others = [`${a} + ${b} = ${sum + 1}`, `${a} + ${b} = ${sum - 1}`, `${a} − ${b} = ${a - b}`];
    return {
      answer,
      options: withDistractors(answer, others.filter((s) => !/-\d|= 0$/.test(s))),
      scene: pair(pics(a, 'shell'), '+', pics(b, 'shell')),
      prompt: '그림에 맞는 식을 골라 봐!',
      hintText: `조개 ${cnt(a)}하고 ${cnt(b)}를 더하면 ${cnt(sum)}야!`,
    };
  },
});

export const SEA_GAMES = Object.freeze({ add: addGame, sub: subGame, eq: eqGame });
