// 농장 마을 게임 3종: 달걀 꾸러미(묶음과 낱개), 두 자리 비교, 장보기 이야기(더하기·빼기 복습)
import { h, art } from '@공통/widgets/dom.js';
import { pickNumber, randInt, nearChoices, pickOne } from '@공통/games/logic.js';
import { makeChoiceGame, withDistractors } from '../choice.js';
import { pics, pair, bundles, tapToCountBundles } from '../visuals.js';
import * as T from '../../audio/step3Script.js';

const SWAP_CHANCE = 0.4; // 23과 32처럼 자리를 바꾼 수를 낼 확률
const SHOP_PROP = 'fruit-apple'; // 장보기 물건 그림 (대사는 T.SHOP_FOOD)

const eggsGame = makeChoiceGame({
  key: 'eggs',
  background: 'farm-base',
  levels: [
    [11, 20],
    [11, 35],
    [21, 50],
  ],
  build({ range, last }) {
    const answer = pickNumber(range[0], range[1], last);
    const scene = bundles(answer, 'egg');
    return {
      answer,
      options: withDistractors(answer, [answer - 10, answer + 10, answer - 1, answer + 1], 10, 59),
      scene,
      setup: (ctx) => tapToCountBundles(scene, ctx),
      prompt: T.EGGS_PROMPT,
      hintText: T.eggsHint(answer),
    };
  },
});

/** 서로 다른 두 수. 가끔 자리를 바꾼 수(23과 32) */
function comparePair(lo, hi) {
  const a = randInt(lo, hi);
  const swapped = (a % 10) * 10 + Math.floor(a / 10);
  if (Math.random() < SWAP_CHANCE && swapped !== a && swapped >= lo && swapped <= hi) return [a, swapped];
  let b = randInt(lo, hi);
  while (b === a) b = randInt(lo, hi);
  return [a, b];
}

const compareGame = makeChoiceGame({
  key: 'compare',
  background: 'farm-base',
  keepOrder: true,
  // [작은 수, 큰 수, 그림(pic) / 숫자만(num)]
  levels: [
    [11, 20, 'pic'],
    [11, 50, 'pic'],
    [11, 50, 'num'],
  ],
  build({ range: [lo, hi, mode] }) {
    const [a, b] = comparePair(lo, hi);
    const answer = Math.max(a, b);
    const side = (animal, n) => h('div', { class: 's3-side' }, art('character', animal), mode === 'pic' ? bundles(n) : null);
    return {
      answer,
      options: [a, b],
      scene: pair(side('chick', a), 'vs', side('pig', b)),
      prompt: T.COMPARE_PROMPT,
      hintText: T.compareHint(answer),
    };
  },
});

const shopGame = makeChoiceGame({
  key: 'shop',
  background: 'farm-base',
  // [가장 큰 수, add: 더하기만 / mix: 빼기도]
  levels: [
    [5, 'add'],
    [8, 'mix'],
    [10, 'mix'],
  ],
  build({ range: [max, kind], last }) {
    if (kind === 'mix' && pickOne([true, false])) {
      const left = pickNumber(1, max - 1, last);
      const b = randInt(1, max - left);
      const total = left + b;
      return {
        answer: left,
        options: nearChoices(left, 0, 10),
        scene: pair(pics(total, SHOP_PROP), '−', pics(b, SHOP_PROP)),
        prompt: T.shopSubPrompt(total, b),
        hintText: T.shopSubHint(total, b),
      };
    }
    const sum = pickNumber(2, max, last);
    const a = randInt(1, sum - 1);
    return {
      answer: sum,
      options: nearChoices(sum, 1, 10),
      scene: pair(pics(a, SHOP_PROP), '+', pics(sum - a, SHOP_PROP)),
      prompt: T.shopAddPrompt(a, sum - a),
      hintText: T.shopAddHint(a, sum - a),
    };
  },
});

export const FARM_GAMES = Object.freeze({ eggs: eggsGame, compare: compareGame, shop: shopGame });
