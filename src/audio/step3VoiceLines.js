// 음성 목록 중 3단계 게임 부분 (voiceLines.js가 이어 붙인다).
// 게임에서 나올 수 있는 숫자 조합을 모두 만든다. 범위는 각 게임 파일(src/games/*/index.js)의 levels와 맞춘다.
import { nativeCount } from '@공통/games/numbers.js';
import * as T from './step3Script.js';

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const line = (group, id, text) => ({ group, id, text });

const COUNT_MAX = 50; // 묶음·낱개를 눌러 셀 때 (열하나 ~ 쉰)
const MAKE_TOTALS = range(5, 10); // 숲속: 만들 수
const STORY_MAX = 8; // 바닷가: 이야기로 묻는 단계의 가장 큰 수
const MATH_MAX = 10; // 10 안 더하기·빼기
const BOARD_MAX = 50;

/** 합이 max 이하인 (a, b) 쌍 (a, b ≥ 1) */
const pairsUpTo = (max) => range(2, max).flatMap((sum) => range(1, sum - 1).map((a) => [a, sum - a]));
/** 전체 total ≤ max, 빼는 수 b, 남는 수 ≥ 1 */
const takesUpTo = (max) => range(2, max).flatMap((total) => range(1, total - 1).map((b) => [total, b]));

function savanna() {
  return [
    ...range(11, COUNT_MAX).map((n) => line('3단계 수 세기', `count-${n}`, nativeCount(n))),
    ...T.FRUITS.map(([prop, name, particle]) => line('3단계 과일 세기', `s3-fruit-q-${prop.replace('fruit-', '')}`, T.fruitPrompt(name, particle))),
    ...range(11, 20).map((n) => line('3단계 과일 세기', `s3-fruit-hint-${n}`, T.fruitHint(n))),
    ...range(10, BOARD_MAX).map((n) => line('3단계 따라 쓰기', `s3-trace-q-${n}`, T.tracePrompt(n))),
  ];
}

function forest() {
  const combos = MAKE_TOTALS.flatMap((total) => range(1, total - 1).map((answer) => [total, answer]));
  return [
    ...combos.map(([t, ans]) => line('3단계 도토리 모으기', `s3-gather-q-${t}-${t - ans}`, T.gatherPrompt(t - ans, t))),
    ...combos.map(([t, ans]) => line('3단계 도토리 모으기', `s3-gather-hint-${t}-${ans}`, T.gatherHint(ans, t))),
    ...combos.map(([t, ans]) => line('3단계 다람쥐 나누기', `s3-split-q-${t}-${t - ans}`, T.splitPrompt(t, t - ans))),
    ...combos.map(([t, ans]) => line('3단계 다람쥐 나누기', `s3-split-hint-${t}-${ans}`, T.splitHint(t - ans, ans, t))),
    ...range(1, 9).map((card) => line('3단계 10 짝꿍', `s3-pair-q-${card}`, T.pairPrompt(card))),
    ...range(1, 9).map((card) => line('3단계 10 짝꿍', `s3-pair-hint-${card}`, T.pairHint(card, 10 - card))),
  ];
}

function sea() {
  return [
    ...pairsUpTo(STORY_MAX).map(([a, b]) => line('3단계 조개 더하기', `s3-add-q-${a}-${b}`, T.addStory(a, b))),
    ...pairsUpTo(MATH_MAX).map(([a, b]) => line('3단계 조개 더하기', `s3-add-eq-${a}-${b}`, T.addEq(a, b))),
    ...pairsUpTo(MATH_MAX).map(([a, b]) => line('3단계 조개 더하기', `s3-add-hint-${a}-${b}`, T.addHint(a, b))),
    ...takesUpTo(STORY_MAX).map(([t, b]) => line('3단계 물고기 빼기', `s3-sub-q-${t}-${b}`, T.subStory(t, b))),
    ...takesUpTo(MATH_MAX).map(([t, b]) => line('3단계 물고기 빼기', `s3-sub-eq-${t}-${b}`, T.subEq(t, b))),
    ...takesUpTo(MATH_MAX).map(([t, b]) => line('3단계 물고기 빼기', `s3-sub-hint-${t}-${b}`, T.subHint(t, b))),
    line('3단계 맞는 식', 's3-eq-q', T.EQ_PROMPT),
    ...pairsUpTo(MATH_MAX).map(([a, b]) => line('3단계 맞는 식', `s3-eq-add-${a}-${b}`, T.eqAddHint(a, b))),
    ...takesUpTo(MATH_MAX).map(([t, b]) => line('3단계 맞는 식', `s3-eq-sub-${t}-${b}`, T.eqSubHint(t, b))),
  ];
}

function dino() {
  return [
    line('3단계 발자국', 's3-steps-q', T.STEPS_PROMPT),
    ...range(11, BOARD_MAX).map((n) => line('3단계 발자국', `s3-steps-next-${n}`, T.stepsHintNext(n))),
    ...range(1, 10).map((n) => line('3단계 발자국', `s3-steps-first-${n}`, T.stepsHintFirst(n))),
    ...range(1, BOARD_MAX - 1).map((n) => line('3단계 하나 큰 수', `s3-plus1-big-${n}`, T.plus1Prompt(n, true))),
    ...range(1, BOARD_MAX - 1).map((n) => line('3단계 하나 큰 수', `s3-plus1-big-hint-${n}`, T.plus1Hint(n, true))),
    ...range(2, BOARD_MAX).map((n) => line('3단계 하나 작은 수', `s3-plus1-small-${n}`, T.plus1Prompt(n, false))),
    ...range(2, BOARD_MAX).map((n) => line('3단계 하나 작은 수', `s3-plus1-small-hint-${n}`, T.plus1Hint(n, false))),
    ...range(1, BOARD_MAX - 10).map((n) => line('3단계 10 큰 수', `s3-plus10-big-${n}`, T.plus10Prompt(n, true))),
    ...range(1, BOARD_MAX - 10).map((n) => line('3단계 10 큰 수', `s3-plus10-big-hint-${n}`, T.plus10Hint(n, true))),
    ...range(11, BOARD_MAX).map((n) => line('3단계 10 작은 수', `s3-plus10-small-${n}`, T.plus10Prompt(n, false))),
    ...range(11, BOARD_MAX).map((n) => line('3단계 10 작은 수', `s3-plus10-small-hint-${n}`, T.plus10Hint(n, false))),
  ];
}

function farm() {
  return [
    line('3단계 달걀 꾸러미', 's3-eggs-q', T.EGGS_PROMPT),
    ...range(11, BOARD_MAX).map((n) => line('3단계 달걀 꾸러미', `s3-eggs-hint-${n}`, T.eggsHint(n))),
    line('3단계 누가 더 많아', 's3-compare-q', T.COMPARE_PROMPT),
    ...range(12, BOARD_MAX).map((n) => line('3단계 누가 더 많아', `s3-compare-hint-${n}`, T.compareHint(n))),
    ...pairsUpTo(MATH_MAX).map(([a, b]) => line('3단계 장보기', `s3-shop-add-${a}-${b}`, T.shopAddPrompt(a, b))),
    ...pairsUpTo(MATH_MAX).map(([a, b]) => line('3단계 장보기', `s3-shop-add-hint-${a}-${b}`, T.shopAddHint(a, b))),
    ...takesUpTo(MATH_MAX).map(([t, b]) => line('3단계 장보기', `s3-shop-sub-${t}-${b}`, T.shopSubPrompt(t, b))),
    ...takesUpTo(MATH_MAX).map(([t, b]) => line('3단계 장보기', `s3-shop-sub-hint-${t}-${b}`, T.shopSubHint(t, b))),
  ];
}

export const step3VoiceLines = () => [...savanna(), ...forest(), ...sea(), ...dino(), ...farm()];
