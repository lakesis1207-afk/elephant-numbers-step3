// 3단계 문제 그림 조각: 그림 여러 개, 10개 묶음, 발자국·숫자 줄, 숫자판, 10칸 점 그림, 큰 글씨
import { h, art } from '@공통/widgets/dom.js';
import { tenFrameEl } from '@공통/games/widgets.js';
import { splitTens } from '@공통/games/questions.js';
import { nativeCount } from '@공통/games/numbers.js';
import { markCount } from '@공통/games/shared/counting.js';

const many = (n, make) => Array.from({ length: n }, (_, i) => make(i));
const TEN = 10;
const MANY_TENS = 3;

/** 그림 n개. 뒤쪽 gone개는 잠시 뒤 헤엄쳐 사라진다 (CSS) */
export const pics = (n, prop, gone = 0) =>
  h('div', { class: 's3-pics' }, many(n, (i) => art('prop', prop, { class: i >= n - gone ? 'gone' : '' })));

/** 두 묶음 사이에 기호 (예: 조개 3개 + 조개 2개) */
export const pair = (left, sign, right) => h('div', { class: 's3-pair' }, left, h('b', { class: 's3-sign' }, sign), right);

/**
 * 10개 묶음 + 낱개. prop이 있으면 그림이고 눌러 셀 수 있다(data-count), 없으면 점 그림(텐프레임).
 */
export function bundles(n, prop) {
  const { bundles: tens, ones } = splitTens(n);
  if (!prop) return h('div', { class: 's3-bundles' }, many(tens, () => tenFrameEl(TEN)), ones ? tenFrameEl(ones) : null);
  const box = () => h('button', { class: 's3-ten', 'data-count': TEN, 'aria-label': '10개 묶음' }, many(TEN, () => art('prop', prop)));
  const loose = () => h('button', { class: 's3-one', 'data-count': 1, 'aria-label': '낱개' }, art('prop', prop));
  const cls = tens >= MANY_TENS ? 's3-bundles many' : 's3-bundles'; // 묶음이 많으면 그림을 조금 작게
  return h('div', { class: cls }, many(tens, box), ones ? h('div', { class: 's3-loose' }, many(ones, loose)) : null);
}

/** 묶음·낱개를 누르면 지금까지 센 수를 붙이고 말한다 (묶음은 열, 스물…, 낱개는 열하나, 열둘…) */
export function tapToCountBundles(scene, { run, say, sfx }) {
  let total = 0;
  scene.querySelectorAll('[data-count]').forEach((item) => {
    item.addEventListener('click', () => {
      run.poke();
      if (item.classList.contains('c') || run.state.busy) return;
      total += Number(item.dataset.count);
      markCount(item, total);
      sfx.pop();
      say(nativeCount(total));
    });
  });
}

/** 숫자 칸 줄. '?' 칸은 물음표 */
export const strip = (cells) =>
  h('div', { class: 's3-strip' }, cells.map((c) => h('span', { class: `s3-cell${c === '?' ? ' q' : ''}` }, h('b', {}, String(c)))));

/** 발자국 줄: 옆으로 걸어가는 모양 (왼발·오른발이 위아래로 번갈아) */
export const footprints = (cells) =>
  h(
    'div',
    { class: 's3-steprow' },
    cells.map((c) => h('span', { class: `s3-step${c === '?' ? ' q' : ''}` }, art('prop', 'footprint'), h('b', {}, String(c)))),
  );

/** 1~50 숫자판. mark는 반짝이는 수, ask는 물음표 칸 */
export const board = (mark, ask) =>
  h(
    'div',
    { class: 's3-board' },
    many(50, (i) => {
      const v = i + 1;
      return h('span', { class: v === mark ? 'on' : v === ask ? 'q' : '' }, v === ask ? '?' : String(v));
    }),
  );

/** 10칸 점 그림 (앞 filled칸 채움). fillMore(k)로 그 뒤 k칸을 다른 색으로 채운다 */
export function frame10(filled) {
  const cells = many(TEN, (i) => h('i', { class: i < filled ? 'f' : '' }));
  const el = h('div', { class: 's3-frame' }, cells);
  const fillMore = (k) => cells.forEach((c, i) => c.classList.toggle('add', i >= filled && i < filled + k));
  return { el, fillMore };
}

export const bigText = (text) => h('div', { class: 's3-big' }, text);

export const column = (...children) => h('div', { class: 's3-col' }, children);
