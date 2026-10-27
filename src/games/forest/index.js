// 숲속 마을 게임 3종: 10 만들기 (모으기, 나누기, 짝꿍). 쉬운 단계는 5·6~9를 만들고, 어려운 단계는 10을 만든다.
import { h, art } from '@공통/widgets/dom.js';
import { pickNumber, randInt, nearChoices } from '@공통/games/logic.js';
import { makeChoiceGame } from '../choice.js';
import { pics, bigText, column, frame10 } from '../visuals.js';
import { cnt } from '../say.js';

const MAKE_LEVELS = [
  [5, 5],
  [6, 9],
  [10, 10],
];

/** 만들 수(total)와 정답(나머지). 정답이 바로 앞 문제와 같지 않게 */
function makeTarget(range, last) {
  const total = randInt(range[0], range[1]);
  const answer = pickNumber(1, total - 1, last);
  return { total, answer, have: total - answer };
}

/** 칸 total개 중 have칸에 도토리 */
const slots = (total, have) =>
  h('div', { class: 's3-slots' }, Array.from({ length: total }, (_, i) => h('i', {}, i < have ? art('prop', 'acorn') : null)));

const gatherGame = makeChoiceGame({
  key: 'gather',
  background: 'forest-base',
  levels: MAKE_LEVELS,
  build({ range, last }) {
    const { total, answer, have } = makeTarget(range, last);
    return {
      answer,
      options: nearChoices(answer, 1, total - 1),
      scene: slots(total, have),
      prompt: `도토리가 ${cnt(have)} 있어. 몇 개 더 모으면 ${cnt(total)}가 될까?`,
      hintText: `빈 칸을 세어 봐! ${cnt(answer)} 더 모으면 ${cnt(total)}야.`,
    };
  },
});

const splitGame = makeChoiceGame({
  key: 'split',
  background: 'forest-base',
  levels: MAKE_LEVELS,
  build({ range, last }) {
    const { total, answer, have } = makeTarget(range, last);
    const tree = (content) => h('div', { class: 's3-tree' }, art('prop', 'tree'), h('div', { class: 's3-crown' }, content));
    return {
      answer,
      options: nearChoices(answer, 1, total - 1),
      scene: column(bigText(`도토리가 모두 ${total}개`), h('div', { class: 's3-pair' }, tree(pics(have, 'acorn')), tree(bigText('?')))),
      prompt: `도토리 ${cnt(total)}를 양쪽 나무에 나눴어. 왼쪽 나무에는 ${cnt(have)}, 오른쪽 나무에는 몇 개일까?`,
      hintText: `왼쪽 ${cnt(have)}하고 오른쪽 ${cnt(answer)}를 합치면 ${cnt(total)}야!`,
    };
  },
});

const pairGame = makeChoiceGame({
  key: 'pair',
  background: 'forest-base',
  levels: [
    [1, 4],
    [1, 9],
    [1, 9],
  ],
  build({ range, last }) {
    const answer = pickNumber(range[0], range[1], last);
    const card = 10 - answer;
    const frame = frame10(card);
    return {
      answer,
      options: nearChoices(answer, 1, 9),
      scene: column(h('div', { class: 's3-card' }, String(card)), frame.el),
      onTry: (value) => frame.fillMore(value),
      prompt: `${card}하고 합쳐서 10이 되는 숫자 카드는 뭘까?`,
      hintText: `빈 칸이 ${cnt(answer)}야. ${card}하고 ${answer}, 합치면 10이야!`,
    };
  },
});

export const FOREST_GAMES = Object.freeze({ gather: gatherGame, split: splitGame, pair: pairGame });
