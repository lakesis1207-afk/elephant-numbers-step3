// 숲속 마을 (3단계 둘째 마을): 10 만들기 (가르기·모으기)

export const FOREST = Object.freeze({
  key: 'forest',
  animals: [
    { key: 'rabbit', name: '토끼' },
    { key: 'squirrel', name: '다람쥐' },
    { key: 'panda', name: '판다' },
    { key: 'fox', name: '여우' },
    { key: 'owl', name: '부엉이' },
    { key: 'hedgehog', name: '고슴도치' },
  ],
  story: {
    title: '도토리 열 개를 모아요!',
    icon: { kind: 'prop', name: 'acorn' },
    enterVoice: '숲속 마을이야! 다람쥐랑 도토리 열 개를 만들어 보자!',
    storyVoice: '도토리 열 개를 모아요! 모으고, 나누고, 짝꿍도 찾아 봐!',
  },
  games: [
    {
      key: 'gather',
      name: '도토리 모으기',
      scene: [
        { kind: 'character', name: 'squirrel', style: 'height:16cqh;left:0;bottom:2cqh' },
        { kind: 'prop', name: 'acorn', style: 'right:1cqh;bottom:3cqh;width:10cqh;height:10cqh' },
      ],
    },
    {
      key: 'split',
      name: '다람쥐 나누기',
      scene: [
        { kind: 'prop', name: 'tree', style: 'left:0;bottom:1cqh;width:16cqh;height:20cqh' },
        { kind: 'prop', name: 'tree', style: 'right:0;bottom:1cqh;width:16cqh;height:20cqh' },
      ],
    },
    {
      key: 'pair',
      name: '10 짝꿍 찾기',
      scene: [
        { kind: 'character', name: 'rabbit', style: 'height:20cqh;left:0;bottom:2cqh' },
        { kind: 'character', name: 'fox', style: 'height:18cqh;right:0;bottom:2cqh' },
      ],
    },
  ],
});
