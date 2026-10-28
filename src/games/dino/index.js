// 공룡 나라 게임 3종: 50까지 수의 순서 (10씩 뛰기, 하나 큰·작은 수, 10 큰·작은 수)
import { pickNumber, randInt, nearChoices, pickOne } from '@공통/games/logic.js';
import { makeChoiceGame, withDistractors } from '../choice.js';
import { strip, board, footprints } from '../visuals.js';
import * as T from '../../audio/step3Script.js';

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
    return {
      answer,
      options: withDistractors(answer, [answer - 10, answer + 10, answer - 1, answer + 1], 1, 59),
      scene: footprints(seq.map((v, i) => (i === at ? '?' : v))),
      prompt: T.STEPS_PROMPT,
      hintText: at > 0 ? T.stepsHintNext(answer) : T.stepsHintFirst(answer),
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
    const big = pickDir(d) === 'big';
    const answer = big ? pickNumber(lo + 1, hi, last) : pickNumber(lo, hi - 1, last);
    const n = big ? answer - 1 : answer + 1;
    const cells = big ? [n - 1, n, '?'].filter((c) => c !== 0) : ['?', n, n + 1];
    return {
      answer,
      options: nearChoices(answer, 1, 50),
      scene: strip(cells),
      prompt: T.plus1Prompt(n, big),
      hintText: T.plus1Hint(n, big),
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
    const big = pickDir(d) === 'big';
    const n = big ? pickNumber(lo, Math.min(hi, 40), last) : pickNumber(Math.max(lo, 11), hi, last);
    const answer = big ? n + 10 : n - 10;
    return {
      answer,
      options: withDistractors(answer, [answer + 1, answer - 1, big ? n + 1 : n - 1], 1, 50),
      scene: board(n, answer),
      prompt: T.plus10Prompt(n, big),
      hintText: T.plus10Hint(n, big),
    };
  },
});

export const DINO_GAMES = Object.freeze({ steps: stepsGame, plus1: plus1Game, plus10: plus10Game });
