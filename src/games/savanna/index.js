// 사바나 마을 게임 3종: 과일 세기(11~20), 두 자리 따라 쓰기, 풍선 숫자 찾기 (key는 villages/savanna.js의 games[].key와 같다)
import { pickNumber, nearChoices, pickOne } from '@공통/games/logic.js';
import { makeChoiceGame } from '../choice.js';
import { bundles, tapToCountBundles } from '../visuals.js';
import { fruitPrompt, fruitHint, FRUITS } from '../../audio/step3Script.js';
import { balloonGame } from './balloon.js';
import { traceGame } from './trace.js';

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
      prompt: fruitPrompt(name, particle),
      hintText: fruitHint(answer),
    };
  },
});

export const SAVANNA_GAMES = Object.freeze({ fruit: fruitGame, trace: traceGame, balloon: balloonGame });
