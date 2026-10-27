// 공룡 나라 (3단계 넷째 마을): 50까지 수의 순서

export const DINO = Object.freeze({
  key: 'dino',
  animals: [
    { key: 'trex', name: '티라노사우루스' },
    { key: 'brachio', name: '브라키오사우루스' },
    { key: 'stego', name: '스테고사우루스' },
    { key: 'ptera', name: '프테라노돈' },
  ],
  story: {
    title: '공룡 발자국을 따라가요!',
    icon: { kind: 'prop', name: 'dino-egg' },
    enterVoice: '공룡 나라야! 오십까지 수를 차례로 따라가 보자!',
    storyVoice: '공룡 발자국을 따라가요! 열씩 뛰고, 하나 큰 수, 열 큰 수도 찾아 봐!',
  },
  games: [
    {
      key: 'steps',
      name: '발자국 10씩 뛰기',
      scene: [
        { kind: 'prop', name: 'footprint', style: 'left:2cqh;bottom:2cqh;width:9cqh;height:11cqh' },
        { kind: 'prop', name: 'footprint', style: 'left:13cqh;bottom:9cqh;width:9cqh;height:11cqh' },
        { kind: 'prop', name: 'footprint', style: 'right:1cqh;bottom:3cqh;width:9cqh;height:11cqh' },
      ],
    },
    {
      key: 'plus1',
      name: '1 큰 수·1 작은 수',
      scene: [
        { kind: 'character', name: 'trex', style: 'height:20cqh;left:0;bottom:2cqh' },
        { kind: 'prop', name: 'board', style: 'right:0;bottom:3cqh;width:15cqh;height:15cqh' },
      ],
    },
    {
      key: 'plus10',
      name: '10 큰 수·10 작은 수',
      scene: [
        { kind: 'character', name: 'brachio', style: 'height:21cqh;left:0;bottom:2cqh' },
        { kind: 'prop', name: 'board', style: 'right:0;bottom:3cqh;width:15cqh;height:15cqh' },
      ],
    },
  ],
});
