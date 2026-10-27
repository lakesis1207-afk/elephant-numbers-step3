// 두 자리 따라 쓰기 (사바나): 1단계 선 긋기처럼 굵은 점선 숫자를 획 순서대로 따라 쓴다 (동물·목표 그림은 없다).
// 초록 점과 화살표가 지금 쓸 획의 시작을 알려 준다. 너그럽게 판정한다(lineTrace.js): 벗어나면 멈추고 기다릴 뿐 틀림은 없다.
// 한동안 가만있으면 노란 점이 지금 획을 한 번 따라가며 보여 준다. 모든 획을 쓰면 정답.
import { h } from '@공통/widgets/dom.js';
import { pickNumber } from '@공통/games/logic.js';
import { pickHandler, replayClass } from '@공통/games/widgets.js';
import { buildPath, pointAt, startTrace, pressTrace, moveTrace, releaseTrace, isDone } from '../lineTrace.js';
import { PICK_PRAISE } from '../choice.js';
import { josa } from '../say.js';
import { LINE_START_HINT, LINE_IDLE_HINT } from '../../audio/villageScript.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const DIGIT_GAP = 64; // 두 숫자 사이 간격 (숫자 하나는 폭 60, 높이 100 안에 그린다)
const TOLERANCE = 11;
const START_DOT = 5.5;
const ARROW_AT = 12; // 시작 화살표를 놓는 거리 (길을 따라)
const IDLE_HINT_MS = 5000;
const DEMO_MS = 2000;
const DEMO_STEP_MS = 40;
const MAX_DEMOS = 2;
const START_HINT_GAP_MS = 3000;
const LINE_COLOR = '#3a8dde';

const CURVE_STEPS = 10; // 곡선 점 사이를 이만큼 잘게 나눈다

/** 점들을 지나는 부드러운 곡선 (캣멀-롬 곡선: 점을 모두 지나면서 매끄럽게 잇는다) */
function curve(...pts) {
  const at = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  const out = [pts[0]];
  for (let i = 0; i < pts.length - 1; i += 1) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let k = 1; k <= CURVE_STEPS; k += 1) {
      const t = k / CURVE_STEPS;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return out;
}

/** 곧은 선 */
const line = (...pts) => pts;

/** 조각들을 한 획으로 잇는다 (이음점은 한 번만) */
const join = (...parts) => parts.reduce((all, part) => (all.length ? all.concat(part.slice(1)) : part), []);

/** 0을 그리는 타원 (위에서 시작해 시계 반대 방향) */
const ZERO = Array.from({ length: 49 }, (_, i) => {
  const t = (i / 48) * Math.PI * 2;
  return [30 - 21 * Math.sin(t), 50 - 40 * Math.cos(t)];
});

// 숫자별 획. 획 순서대로 쓴다. 둥근 곳은 curve, 곧은 곳은 line.
const DIGITS = [
  [ZERO],
  [line([30, 10], [30, 90])],
  [join(curve([12, 28], [18, 14], [30, 9], [43, 13], [48, 26], [44, 41], [30, 58], [12, 90]), line([12, 90], [52, 90]))],
  [join(curve([12, 18], [26, 9], [42, 12], [48, 26], [40, 41], [27, 47]), curve([27, 47], [43, 53], [50, 70], [44, 86], [28, 92], [12, 85]))],
  [line([38, 10], [8, 64], [54, 64]), line([42, 34], [42, 92])],
  [join(line([16, 10], [13, 44]), curve([13, 44], [28, 38], [44, 44], [50, 62], [45, 82], [30, 91], [12, 86])), line([16, 10], [48, 10])],
  [curve([44, 12], [30, 22], [18, 40], [12, 62], [16, 82], [30, 91], [44, 84], [49, 68], [42, 54], [29, 50], [17, 56], [13, 66])],
  [join(line([10, 12], [50, 12]), curve([50, 12], [39, 38], [31, 64], [28, 92]))],
  [curve([45, 21], [30, 9], [15, 18], [16, 33], [30, 46], [46, 60], [48, 78], [30, 92], [13, 80], [14, 61], [30, 46], [44, 33], [45, 21])],
  [join(curve([47, 30], [40, 15], [28, 10], [15, 17], [12, 32], [20, 45], [32, 47], [44, 38], [47, 30]), curve([47, 30], [47, 60], [46, 90]))],
];

/** 수 n의 모든 획 (두 자리면 둘째 숫자는 오른쪽으로 옮긴다) */
export function strokesOf(n) {
  return String(n)
    .split('')
    .flatMap((d, i) => DIGITS[Number(d)].map((pts) => pts.map(([x, y]) => [x + i * DIGIT_GAP, y])));
}

function svg(tag, attrs = {}, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  el.append(...children);
  return el;
}

const dOf = (points) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
const placeAt = (el, [x, y]) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);

/** 획 하나: 하얀 바탕길 + 점선 + 채워지는 색 선 (1단계 선 긋기와 같은 모양) */
function strokeLayer(path) {
  const d = dOf(path.points);
  const fill = svg('path', { class: 'lfill', d, pathLength: path.length, 'stroke-dasharray': `${path.length} ${path.length + 1}` });
  const draw = (reached) => {
    fill.setAttribute('stroke-dashoffset', String(path.length - reached));
    fill.style.visibility = reached > 0 ? '' : 'hidden';
  };
  draw(0);
  return { bed: svg('path', { class: 'lbed', d }), guide: svg('path', { class: 'lguide', d }), fill, draw };
}

/** 시작 화살표: 획이 처음 나아가는 방향을 가리킨다 */
function placeArrow(arrow, path) {
  const at = Math.min(ARROW_AT, path.length / 2);
  const [ax, ay] = pointAt(path, at - 2);
  const [bx, by] = pointAt(path, at + 2);
  const deg = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
  const [x, y] = pointAt(path, at);
  arrow.setAttribute('transform', `translate(${x} ${y}) rotate(${deg})`);
}

export const traceGame = {
  key: 'trace',
  background: 'savanna-base',
  praise: PICK_PRAISE,
  levels: [
    [10, 20],
    [21, 30],
    [31, 50],
  ],

  ask(play, { run, bubble, sfx }, { range, last }) {
    const n = pickNumber(range[0], range[1], last);
    const paths = strokesOf(n).map(buildPath);
    const layers = paths.map(strokeLayer);
    const width = String(n).length * DIGIT_GAP;
    const start = svg('g', { class: 'lstart' }, svg('circle', { r: START_DOT }));
    const arrow = svg('polygon', { class: 'larrow', points: '-3.2,-3.6 3.8,0 -3.2,3.6' });
    const hintDot = svg('circle', { class: 'lhint', r: 4 });
    const board = svg(
      'svg',
      { class: 'lineq s3-trace', viewBox: `-12 -10 ${width + 20} 120`, style: `--line:${LINE_COLOR}`, role: 'img', 'aria-label': `숫자 ${n} 따라 쓰기` },
      ...layers.map((l) => l.bed),
      ...layers.map((l) => l.guide),
      ...layers.map((l) => l.fill),
      start,
      arrow,
      hintDot,
    );

    let index = 0;
    let trace = startTrace();
    let finished = false;
    let idleTimer = null;
    let demoTimer = null;
    let demos = 0;
    let lastStartHint = 0;
    const opts = { tolerance: TOLERANCE };
    const onDone = pickHandler(run, n);

    function showStart() {
      placeAt(start, pointAt(paths[index], trace.reached));
      placeArrow(arrow, paths[index]);
      arrow.style.visibility = trace.reached > 0 ? 'hidden' : '';
    }

    const alive = () => board.isConnected && !run.state.stopped && !finished;

    function stopDemo() {
      clearInterval(demoTimer);
      demoTimer = null;
      hintDot.classList.remove('on');
    }

    function armIdle() {
      clearTimeout(idleTimer);
      if (demos >= MAX_DEMOS) return;
      idleTimer = setTimeout(() => {
        if (!alive() || run.state.busy || trace.active) return;
        demos += 1;
        bubble(LINE_IDLE_HINT, true);
        const path = paths[index];
        const from = trace.reached;
        const began = Date.now();
        hintDot.classList.add('on');
        demoTimer = setInterval(() => {
          const t = Math.min((Date.now() - began) / DEMO_MS, 1);
          if (!alive()) return stopDemo();
          placeAt(hintDot, pointAt(path, from + (path.length - from) * t));
          if (t >= 1) {
            stopDemo();
            armIdle();
          }
        }, DEMO_STEP_MS);
      }, IDLE_HINT_MS);
    }

    function nextStroke() {
      layers[index].draw(paths[index].length);
      sfx.pop();
      index += 1;
      trace = startTrace();
      board.classList.remove('drawing');
      if (index < paths.length) {
        showStart();
        armIdle();
        return;
      }
      finished = true;
      clearTimeout(idleTimer);
      stopDemo();
      start.remove();
      arrow.remove();
      onDone(n, board);
    }

    const toLocal = (e) => {
      const m = board.getScreenCTM();
      if (!m) return null;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      return [p.x, p.y];
    };

    board.addEventListener('pointerdown', (e) => {
      run.poke();
      if (finished || run.state.busy) return;
      const p = toLocal(e);
      if (!p) return;
      e.preventDefault();
      clearTimeout(idleTimer);
      stopDemo();
      trace = pressTrace(paths[index], trace, p, opts);
      if (trace.active) {
        board.setPointerCapture?.(e.pointerId);
        board.classList.add('drawing');
        return;
      }
      replayClass(start, 'hl'); // 엉뚱한 곳을 눌렀으면 이어 쓸 자리를 반짝인다
      if (Date.now() - lastStartHint > START_HINT_GAP_MS) {
        lastStartHint = Date.now();
        bubble(LINE_START_HINT, true);
      }
      armIdle();
    });

    board.addEventListener('pointermove', (e) => {
      if (!trace.active || finished) return;
      const p = toLocal(e);
      if (!p) return;
      run.poke();
      trace = moveTrace(paths[index], trace, p, opts);
      layers[index].draw(trace.reached);
      showStart();
      if (isDone(paths[index], trace)) nextStroke();
    });

    const release = () => {
      if (!trace.active || finished) return;
      trace = releaseTrace(trace);
      board.classList.remove('drawing');
      armIdle();
    };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => board.addEventListener(ev, release));

    showStart();
    play.replaceChildren(h('div', { class: 's3q' }, board));
    armIdle();

    // 틀리는 일이 없어서 엔진이 힌트를 부르지 않는다. 힌트는 위의 가만있기 안내가 맡는다.
    return { n, prompt: `숫자 ${n}${josa(n, '을', '를')} 따라 써 봐! 초록 점부터 시작해.`, hint: async () => {} };
  },
};
