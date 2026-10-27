// 바닷가 마을 (3단계 셋째 마을): 10 안 더하기·빼기와 식 (+ − =)

export const SEA = Object.freeze({
  key: 'sea',
  animals: [
    { key: 'penguin', name: '펭귄' },
    { key: 'crab', name: '꽃게' },
    { key: 'turtle', name: '거북이' },
    { key: 'dolphin', name: '돌고래' },
    { key: 'starfish', name: '불가사리' },
    { key: 'seaotter', name: '해달' },
  ],
  story: {
    title: '펭귄이랑 더하고 빼요!',
    icon: { kind: 'prop', name: 'shell' },
    enterVoice: '바닷가 마을이야! 펭귄이랑 더하기 빼기를 해 보자!',
    storyVoice: '펭귄이랑 더하고 빼요! 조개를 더하고, 물고기를 빼고, 맞는 식도 찾아 봐!',
  },
  games: [
    {
      key: 'add',
      name: '조개 더하기',
      scene: [
        { kind: 'character', name: 'penguin', style: 'height:19cqh;left:0;bottom:2cqh' },
        { kind: 'prop', name: 'shell', style: 'right:1cqh;bottom:3cqh;width:10cqh;height:10cqh' },
      ],
    },
    {
      key: 'sub',
      name: '물고기 빼기',
      scene: [
        { kind: 'character', name: 'seaotter', style: 'height:19cqh;left:0;bottom:2cqh' },
        { kind: 'prop', name: 'fish', style: 'right:1cqh;bottom:3cqh;width:11cqh;height:9cqh' },
      ],
    },
    {
      key: 'eq',
      name: '맞는 식 고르기',
      scene: [
        { kind: 'character', name: 'turtle', style: 'height:16cqh;left:0;bottom:2cqh' },
        { kind: 'prop', name: 'star', style: 'right:1cqh;bottom:4cqh;width:10cqh;height:10cqh' },
      ],
    },
  ],
});
