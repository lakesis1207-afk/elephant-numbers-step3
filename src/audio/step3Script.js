// 3단계 게임 대사 모음. 게임(src/games)은 여기 있는 문장만 쓰고, 음성 목록(step3VoiceLines.js)도 여기서 만든다.
// 개수는 우리말(cnt: "다섯 개"), 수 읽기는 숫자 그대로("3 더하기 2"). 조사는 받침에 맞게 붙인다(josa, isIt).
import { cnt, josa, isIt, sayEq } from '../games/say.js';

// 사바나: 과일 세기 (11~20), 따라 쓰기, 풍선은 villageScript.js
// [그림 이름, 과일 이름, 붙는 말(이/가)]
export const FRUITS = Object.freeze([
  ['fruit-apple', '사과', '가'],
  ['fruit-strawberry', '딸기', '가'],
  ['fruit-orange', '귤', '이'],
  ['fruit-grape', '포도', '가'],
]);
export const fruitPrompt = (name, particle) => `${name}${particle} 모두 몇 개일까? 묶음부터 눌러서 세어 봐!`;
export const fruitHint = (n) =>
  n === 20 ? '열 개 묶음이 두 개, 모두 스무 개야!' : `열 개 묶음 하나하고 낱개 ${cnt(n - 10)}, 모두 ${cnt(n)}야!`;
export const tracePrompt = (n) => `숫자 ${n}${josa(n, '을', '를')} 따라 써 봐! 초록 점부터 시작해.`;

// 숲속: 10 만들기
export const gatherPrompt = (have, total) => `도토리가 ${cnt(have)} 있어. 몇 개 더 모으면 ${cnt(total)}가 될까?`;
export const gatherHint = (answer, total) => `빈 칸을 세어 봐! ${cnt(answer)} 더 모으면 ${cnt(total)}야.`;
export const splitPrompt = (total, have) =>
  `도토리 ${cnt(total)}를 양쪽 나무에 나눴어. 왼쪽 나무에는 ${cnt(have)}, 오른쪽 나무에는 몇 개일까?`;
export const splitHint = (have, answer, total) => `왼쪽 ${cnt(have)}하고 오른쪽 ${cnt(answer)}를 합치면 ${cnt(total)}야!`;
export const pairPrompt = (card) => `${card}하고 합쳐서 10이 되는 숫자 카드는 뭘까?`;
export const pairHint = (card, answer) => `빈 칸이 ${cnt(answer)}야. ${card}하고 ${answer}, 합치면 10이야!`;

// 바닷가: 더하기·빼기와 식
export const addStory = (a, b) => `조개가 ${cnt(a)} 있었는데 ${cnt(b)}가 더 왔어. 모두 몇 개일까?`;
export const addEq = (a, b) => `${a} 더하기 ${b}${josa(b, '은', '는')} 얼마일까?`;
export const addHint = (a, b) => `${sayEq(a, '더하기', b, a + b)}!`;
export const subStory = (total, b) => `물고기 ${cnt(total, '마리')} 중에 ${cnt(b, '마리')}가 헤엄쳐 갔어. 몇 마리 남았을까?`;
export const subEq = (total, b) => `${total} 빼기 ${b}${josa(b, '은', '는')} 얼마일까?`;
export const subHint = (total, b) => `${sayEq(total, '빼기', b, total - b)}!`;
export const EQ_PROMPT = '그림에 맞는 식을 골라 봐!';
export const eqAddHint = (a, b) => `조개 ${cnt(a)}하고 ${cnt(b)}를 더하면 ${cnt(a + b)}야!`;
export const eqSubHint = (total, b) =>
  `물고기 ${cnt(total, '마리')}에서 ${cnt(b, '마리')}가 가면 ${cnt(total - b, '마리')}가 남아!`;

// 공룡 나라: 50까지 수의 순서
export const STEPS_PROMPT = '공룡이 10씩 뛰어가! 물음표 자리에는 어떤 수가 올까?';
export const stepsHintNext = (answer) => `${answer - 10}에서 10 더 가면 ${isIt(answer)}!`;
export const stepsHintFirst = (answer) => `${answer + 10}보다 10 작은 수는 ${isIt(answer)}!`;
export const plus1Prompt = (n, big) => `${n}보다 하나 ${big ? '큰' : '작은'} 수는 뭘까?`;
export const plus1Hint = (n, big) => (big ? `${n} 바로 다음 수는 ${isIt(n + 1)}!` : `${n} 바로 앞의 수는 ${isIt(n - 1)}!`);
export const plus10Prompt = (n, big) =>
  big ? `${n}보다 10 큰 수는 뭘까? 숫자판에서 바로 아래 칸이야.` : `${n}보다 10 작은 수는 뭘까? 숫자판에서 바로 위 칸이야.`;
export const plus10Hint = (n, big) =>
  `${n}보다 10 ${big ? '큰' : '작은'} 수는 ${isIt(big ? n + 10 : n - 10)}! 바로 ${big ? '아래' : '위'} 칸이지.`;

// 농장: 묶음과 낱개, 비교, 장보기
export const EGGS_PROMPT = '달걀이 모두 몇 개일까? 꾸러미 하나에 열 개씩이야. 눌러서 세어 봐!';
export function eggsHint(n) {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `꾸러미 ${cnt(tens)}는 ${cnt(tens * 10)}${ones ? `, 낱개가 ${cnt(ones)}` : ''}. 모두 ${cnt(n)}야!`;
}
export const COMPARE_PROMPT = '누가 더 많이 가졌을까? 더 큰 수를 눌러 봐!';
export const compareHint = (answer) => `열 개 묶음이 몇 개인지 먼저 봐! 더 큰 수는 ${isIt(answer)}.`;
export const SHOP_FOOD = '사과'; // 장보기 물건 (녹음 수를 줄이려고 하나만)
export const shopAddPrompt = (a, b) => `${SHOP_FOOD} ${cnt(a)}가 있어. ${cnt(b)}를 더 사면 모두 몇 개일까?`;
export const shopAddHint = (a, b) => `${cnt(a)}에 ${cnt(b)}를 더 사면 모두 ${cnt(a + b)}야!`;
export const shopSubPrompt = (total, b) => `${SHOP_FOOD} ${cnt(total)}가 있어. ${cnt(b)}를 먹으면 몇 개 남을까?`;
export const shopSubHint = (total, b) => `${cnt(total)}에서 ${cnt(b)}를 먹으면 ${cnt(total - b)}가 남아!`;
