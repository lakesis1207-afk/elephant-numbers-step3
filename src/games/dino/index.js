// 공룡 나라 게임 3종: 50까지 수의 순서 (10씩 뛰기, 하나 큰·작은 수, 10 큰·작은 수)
import { pickNumber, randInt, nearChoices, pickOne } from '@공통/games/logic.js';
import { makeChoiceGame, withDistractors } from '../choice.js';
import { strip, board, footprints } from '../visuals.js';
import { isIt } from '../say.js';

const STEPS = 5; // 발자국 수

const stepsGame = makeChoiceGame({
  key: 'steps',
  background: 'dino-base',
  // [시작 수(0이면 1~9 중 하나), 빈칸 자리(end: 마지막, any: 아무 데나)]
  levels: [
    [10, 'end'],
    [10, 'any'],
    [0, 'any'],
  ],
  build({ range: [first, blank] }) {
    const start = first || randInt(1, 9);
    const seq = Array.from({ length: STEPS }, (_, i) => start + i * 10);
    const at = blank === 'end' ? STEPS - 1 : randInt(0, STEPS - 1);
    const answer = seq[at];
    const hintText = at > 0 ? `${seq[at - 1]}에서 10 더 가면 ${isIt(answer)}!` : `${seq[1]}보다 10 작은 수는 ${isIt(answer)}!`;
    return {
      answer,
      options: withDistractors(answer, [answer - 10, answer + 10, answer - 1, answer + 1], 1, 59),
      scene: footprints(seq.map((v, i) => (i === at ? '?' : v))),
      prompt: '공룡이 10씩 뛰어가! 물음표 자리에는 어떤 수가 올까?',
      hintText,
    };
  },
});

/** 'big'이면 큰 쪽, 'small'이면 작은 쪽, 'any'면 둘 중 하나 */
const pickDir = (dir) => (dir === 'any' ? pickOne(['big', 'small']) : dir);

const plus1Game = makeChoiceGame({
  key: 'plus1',
  background: 'dino-base',
  levels: [
    [1, 20, 'big'],
    [1, 50, 'big'],
    [1, 50, 'any'],
  ],
  build({ range: [lo, hi, d], last }) {
    const dir = pickDir(d);
    const answer = dir === 'big' ? pickNumber(lo + 1, hi, last) : pickNumber(lo, hi - 1, last);
    const n = dir === 'big' ? answer - 1 : answer + 1;
    const cells = dir === 'big' ? [n - 1, n, '?'].filter((c) => c !== 0) : ['?', n, n + 1];
    return {
      answer,
      options: nearChoices(answer, 1, 50),
      scene: strip(cells),
      prompt: dir === 'big' ? `${n}보다 하나 큰 수는 뭘까?` : `${n}보다 하나 작은 수는 뭘까?`,
      hintText: dir === 'big' ? `${n} 바로 다음 수는 ${isIt(answer)}!` : `${n} 바로 앞의 수는 ${isIt(answer)}!`,
    };
  },
});

const plus10Game = makeChoiceGame({
  key: 'plus10',
  background: 'dino-base',
  levels: [
    [1, 40, 'big'],
    [11, 50, 'small'],
    [1, 50, 'any'],
  ],
  build({ range: [lo, hi, d], last }) {
    const dir = pickDir(d);
    const n = dir === 'big' ? pickNumber(lo, Math.min(hi, 40), last) : pickNumber(Math.max(lo, 11), hi, last);
    const answer = dir === 'big' ? n + 10 : n - 10;
    return {
      answer,
      options: withDistractors(answer, [answer + 1, answer - 1, dir === 'big' ? n + 1 : n - 1], 1, 50),
      scene: board(n, answer),
      prompt:
        dir === 'big'
          ? `${n}보다 10 큰 수는 뭘까? 숫자판에서 바로 아래 칸이야.`
          : `${n}보다 10 작은 수는 뭘까? 숫자판에서 바로 위 칸이야.`,
      hintText: `${n}보다 10 ${dir === 'big' ? '큰' : '작은'} 수는 ${isIt(answer)}! 바로 ${dir === 'big' ? '아래' : '위'} 칸이지.`,
    };
  },
});

export const DINO_GAMES = Object.freeze({ steps: stepsGame, plus1: plus1Game, plus10: plus10Game });
