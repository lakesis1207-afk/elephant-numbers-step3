// 3단계 고르기 게임 틀: 문제 그림(scene) + 보기 버튼. 게임마다 build()로 문제만 만든다.
// build({ range, last }) → { answer, options, scene, prompt, hintText, setup?, onTry? }
//   setup(ctx): 그림을 화면에 넣은 뒤 부른다 (눌러 세기 등). ctx = { run, say, sfx, bubble }
//   onTry(value): 보기를 누를 때마다 부른다 (맞고 틀림과 상관없이 그림을 바꿀 때)
import { h } from '@공통/widgets/dom.js';
import { wait, shuffle, PRAISE } from '@공통/games/logic.js';
import { numberButtons, pickHandler } from '@공통/games/widgets.js';

const HINT_MS = 1600;
// 고르기 게임이라 "세었네" 칭찬은 뺀다
export const PICK_PRAISE = Object.freeze(PRAISE.filter((p) => !/세었|셌|세어/.test(p)));

/** 정답과 다른 보기 (범위 안, 겹치지 않게) count-1개 + 정답 */
export function withDistractors(answer, candidates, lo = null, hi = null, count = 3) {
  const inRange = (v) => (lo == null || v >= lo) && (hi == null || v <= hi);
  const others = [...new Set(candidates)].filter((v) => v !== answer && inRange(v));
  return [answer, ...shuffle(others).slice(0, count - 1)];
}

export function makeChoiceGame({ key, background, levels, build, wide = false, keepOrder = false }) {
  return {
    key,
    background,
    levels,
    praise: PICK_PRAISE,
    ask(play, { run, say, bubble, sfx }, info) {
      const q = build(info);
      const values = keepOrder ? q.options : shuffle(q.options);
      const judge = pickHandler(run, q.answer);
      const opts = numberButtons(values, (value, btn) => {
        if (!run.state.busy) q.onTry?.(value);
        return judge(value, btn);
      });
      if (wide) opts.classList.add('wide');
      play.replaceChildren(h('div', { class: 's3q' }, q.scene, opts));
      q.setup?.({ run, say, sfx, bubble });

      async function hint() {
        const right = [...opts.children].find((b) => b.dataset.value === String(q.answer));
        right?.classList.add('hl');
        bubble(q.hintText, true);
        await wait(HINT_MS);
      }
      return { n: q.answer, prompt: q.prompt, hint };
    },
  };
}
