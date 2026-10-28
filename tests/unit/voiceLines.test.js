import { describe, test, expect } from 'vitest';
import { VOICE_LINES, voiceIdOf } from '../../src/audio/voiceLines.js';
import * as script from '../../src/audio/script.js';
import * as step3 from '../../src/audio/step3Script.js';
import { NATIVE, PRAISE } from '@공통/games/logic.js';
import { RETRY_TEXT, IDLE_TEXT } from '@공통/games/engine.js';
import { MISSIONS } from '../../src/app/playtime.js';
import { SAVANNA } from '../../src/villages/savanna.js';

describe('음성 목록', () => {
  test('파일 이름과 문장은 모두 한 번씩만 나온다', () => {
    const ids = VOICE_LINES.map((l) => l.id);
    const texts = VOICE_LINES.map((l) => l.text);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(texts).size).toBe(texts.length);
  });

  test('파일 이름은 영문 소문자·숫자·하이픈만 쓴다', () => {
    VOICE_LINES.forEach(({ id }) => expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
  });

  test('수 세기, 칭찬, 다시 세기, 알림이 모두 들어 있다', () => {
    expect(voiceIdOf(NATIVE[3])).toBe('count-3');
    PRAISE.forEach((p) => expect(voiceIdOf(p)).toBeTruthy());
    expect(voiceIdOf(RETRY_TEXT)).toBeTruthy();
    expect(voiceIdOf(IDLE_TEXT)).toBeTruthy();
    expect(voiceIdOf(script.WARN_TEXT)).toBeTruthy();
  });

  test('3단계 게임 문제와 힌트는 나올 수 있는 수만큼 모두 들어 있다', () => {
    for (let total = 5; total <= 10; total++) {
      for (let have = 1; have < total; have++) expect(voiceIdOf(step3.gatherPrompt(have, total))).toBeTruthy();
    }
    for (let n = 10; n <= 50; n++) expect(voiceIdOf(step3.tracePrompt(n))).toBeTruthy();
    for (let n = 11; n <= 50; n++) expect(voiceIdOf(step3.eggsHint(n))).toBeTruthy();
    expect(voiceIdOf(step3.addEq(3, 7))).toBe('s3-add-eq-3-7');
    expect(voiceIdOf(step3.subStory(8, 3))).toBe('s3-sub-q-8-3');
    expect(voiceIdOf(step3.fruitPrompt('귤', '이'))).toBe('s3-fruit-q-orange');
  });

  test('스티커·잠금 문장도 들어 있다', () => {
    SAVANNA.animals.forEach((a) => {
      expect(voiceIdOf(script.stickerLine(a.name, true))).toBeTruthy();
      expect(voiceIdOf(script.stickerLine(a.name, false, '숲속 마을'))).toBeTruthy();
      expect(voiceIdOf(a.name)).toBeTruthy();
    });
    MISSIONS.forEach((m) => expect(voiceIdOf(script.lockLine(m))).toBeTruthy());
  });

  test('목록에 없는 문장은 null', () => {
    expect(voiceIdOf('없는 문장')).toBeNull();
  });
});
