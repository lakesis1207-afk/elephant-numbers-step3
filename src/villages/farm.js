// 농장 마을 (3단계 다섯째 마을): 묶음과 낱개, 두 자리 비교, 장보기 복습

export const FARM = Object.freeze({
  key: 'farm',
  animals: [
    { key: 'dog', name: '강아지' },
    { key: 'cat', name: '고양이' },
    { key: 'chick', name: '병아리' },
    { key: 'pig', name: '돼지' },
    { key: 'cow', name: '젖소' },
  ],
  story: {
    title: '농장 친구들을 도와요!',
    icon: { kind: 'prop', name: 'basket' },
    enterVoice: '농장 마을이야! 달걀도 세고, 장도 보러 가자!',
    storyVoice: '농장 친구들을 도와요! 달걀 꾸러미를 세고, 누가 더 많은지 보고, 장도 봐!',
  },
  games: [
    {
      key: 'eggs',
      name: '달걀 꾸러미',
      scene: [
        { kind: 'prop', name: 'basket', style: 'left:0;bottom:1cqh;width:22cqh;height:16cqh' },
        { kind: 'prop', name: 'egg', style: 'right:2cqh;bottom:4cqh;width:8cqh;height:10cqh' },
      ],
    },
    {
      key: 'compare',
      name: '누가 더 많아?',
      scene: [
        { kind: 'character', name: 'chick', style: 'height:13cqh;left:0;bottom:2cqh' },
        { kind: 'character', name: 'pig', style: 'height:17cqh;right:0;bottom:2cqh' },
      ],
    },
    {
      key: 'shop',
      name: '장보기 이야기',
      scene: [
        { kind: 'character', name: 'dog', style: 'height:18cqh;left:0;bottom:2cqh' },
        { kind: 'prop', name: 'corn', style: 'right:1cqh;bottom:3cqh;width:10cqh;height:12cqh' },
      ],
    },
  ],
});
