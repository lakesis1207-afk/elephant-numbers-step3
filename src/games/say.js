// 대사 도우미: 숫자 뒤에 받침에 맞는 조사를 붙인다 (23 → "이십삼"이라 "23이야", 4 → "사"라 "4야")
import { sinoWord, nativeAdj } from '@공통/games/numbers.js';

/** 개수는 우리말로: cnt(5) → "다섯 개", cnt(3, '마리') → "세 마리" (숫자로 쓰면 음성이 어색하게 읽는다) */
export const cnt = (n, unit = '개') => `${nativeAdj(n)} ${unit}`;

const HANGUL_START = 0xac00;
const HANGUL_COUNT = 11172;
const FINALS = 28;

const readOf = (x) => (typeof x === 'number' ? (x === 0 ? '영' : sinoWord(x)) : String(x));

function hasFinal(word) {
  const code = word.charCodeAt(word.length - 1) - HANGUL_START;
  return code >= 0 && code < HANGUL_COUNT && code % FINALS !== 0;
}

/** 받침이 있으면 withFinal, 없으면 without: josa(23, '을', '를') → '을' */
export const josa = (x, withFinal, without) => (hasFinal(readOf(x)) ? withFinal : without);

/** "23이야" / "4야" */
export const isIt = (n) => `${n}${josa(n, '이야', '야')}`;

/** "3 더하기 2는 5야" */
export const sayEq = (a, op, b, r) => `${a} ${op} ${b}${josa(b, '은', '는')} ${isIt(r)}`;
