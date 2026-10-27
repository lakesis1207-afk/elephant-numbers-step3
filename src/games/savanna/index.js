// 사바나 마을 게임 3종: 과일 세기(11~20), 두 자리 따라 쓰기, 풍선 숫자 찾기 (key는 villages/savanna.js의 games[].key와 같다)
import { pickNumber, nearChoices, pickOne } from '@공통/games/logic.js';
import { makeChoiceGame } from '../choice.js';
import { bundles, tapToCountBundles } from '../visuals.js';
import { cnt } from '../say.js';
import { balloonGame } from './balloon.js';
import { traceGame } from './trace.js';

// [그림 이름, 과일 이름, 붙는 말(이/가)]
const FRUITS = [
  ['fruit-apple', '사과', '가'],
  ['fruit-strawberry', '딸기', '가'],
  ['fruit-orange', '귤', '이'],
  ['fruit-grape', '포도', '가'],
];

const fruitGame = makeChoiceGame({
  key: 'fruit',
  background: 'savanna-base',
  levels: [
    [11, 13],
    [11, 16],
    [13, 20],
  ],
  build({ range, last }) {
    const answer = pickNumber(range[0], range[1], last);
    const [prop, name, particle] = pickOne(FRUITS);
    const scene = bundles(answer, prop);
    return {
      answer,
      options: nearChoices(answer, 10, 20),
      scene,
      setup: (ctx) => tapToCountBundles(scene, ctx),
      prompt: `${name}${particle} 모두 몇 개일까? 묶음부터 눌러서 세어 봐!`,
      hintText: answer === 20 ? '열 개 묶음이 두 개, 모두 스무 개야!' : `열 개 묶음 하나하고 낱개 ${cnt(answer - 10)}, 모두 ${cnt(answer)}야!`,
    };
  },
});

export const SAVANNA_GAMES = Object.freeze({ fruit: fruitGame, trace: traceGame, balloon: balloonGame });
