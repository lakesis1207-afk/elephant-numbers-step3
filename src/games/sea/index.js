// 바닷가 마을 게임 3종: 10 안 더하기·빼기와 식. 단계: 그림만(pic) → 그림과 식(both) → 식만(eq)
import { pickNumber, randInt, nearChoices, pickOne } from '@공통/games/logic.js';
import { makeChoiceGame, withDistractors } from '../choice.js';
import { pics, pair, bigText, column } from '../visuals.js';
import * as T from '../../audio/step3Script.js';

// [가장 큰 수, 보여 주는 방식]. 음성 목록(step3VoiceLines.js)은 이야기 단계(pic·both) 8까지, 식 단계 10까지를 만든다
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
      prompt: mode === 'eq' ? T.addEq(a, b) : T.addStory(a, b),
      hintText: T.addHint(a, b),
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
      prompt: mode === 'eq' ? T.subEq(total, b) : T.subStory(total, b),
      hintText: T.subHint(total, b),
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
        prompt: T.EQ_PROMPT,
        hintText: T.eqSubHint(total, b),
      };
    }
    const { a, b, sum } = addQuestion(max);
    const answer = `${a} + ${b} = ${sum}`;
    const others = [`${a} + ${b} = ${sum + 1}`, `${a} + ${b} = ${sum - 1}`, `${a} − ${b} = ${a - b}`];
    return {
      answer,
      options: withDistractors(answer, others.filter((s) => !/-\d|= 0$/.test(s))),
      scene: pair(pics(a, 'shell'), '+', pics(b, 'shell')),
      prompt: T.EQ_PROMPT,
      hintText: T.eqAddHint(a, b),
    };
  },
});

export const SEA_GAMES = Object.freeze({ add: addGame, sub: subGame, eq: eqGame });
