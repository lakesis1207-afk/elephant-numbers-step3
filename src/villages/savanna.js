// 사바나 마을 (3단계 첫 마을): 두 자리 수와 친해지기

export const SAVANNA = Object.freeze({
  key: 'savanna',
  animals: [
    { key: 'elephant', name: '코끼리' },
    { key: 'giraffe', name: '기린' },
    { key: 'hippo', name: '하마' },
    { key: 'rhino', name: '코뿔소' },
    { key: 'lion', name: '사자' },
    { key: 'tiger', name: '호랑이' },
    { key: 'zebra', name: '얼룩말' },
    { key: 'lemur', name: '여우원숭이' },
    { key: 'capybara', name: '카피바라' },
  ],
  // 동물을 다 모으면 오는 특별 친구 (다른 마을은 아직 없음)
  // from: "사바나 친구들을 다 모았어!"의 앞말
  special: { key: 'owl', name: '부엉이', from: '사바나' },
  story: {
    title: '두 자리 수와 친해져요!',
    icon: { kind: 'icon', name: 'game-fruit' },
    enterVoice: '사바나 마을이야! 열보다 큰 수랑 친해져 보자!',
    storyVoice: '두 자리 수와 친해져요! 과일도 세고, 숫자도 써 보고, 풍선도 터뜨려 봐!',
  },
  // 게임 카드 그림: kind는 그림 종류(character/prop), name은 그림 이름, style은 카드 안 위치
  games: [
    {
      key: 'fruit',
      name: '과일 세기',
      icon: 'game-fruit',
      scene: [
        { kind: 'character', name: 'elephant', style: 'height:19cqh;left:0;bottom:2cqh' },
        { kind: 'prop', name: 'fruit-apple', style: 'right:-1cqh;bottom:1cqh;width:12cqh;height:12cqh' },
        { kind: 'prop', name: 'fruit-banana', style: 'right:-1cqh;bottom:13cqh;width:11cqh;height:11cqh' },
      ],
    },
    {
      key: 'trace',
      name: '두 자리 따라 쓰기',
      scene: [
        { kind: 'character', name: 'giraffe', style: 'height:21cqh;left:0;bottom:2cqh' },
        { kind: 'prop', name: 'board', style: 'right:0;bottom:3cqh;width:15cqh;height:15cqh' },
      ],
    },
    {
      key: 'balloon',
      name: '풍선 숫자 찾기',
      scene: [
        { kind: 'character', name: 'zebra', style: 'height:20cqh;left:0;bottom:2cqh' },
        { kind: 'prop', name: 'balloon-red', style: 'right:0;bottom:8cqh;width:11cqh;height:15cqh' },
        { kind: 'prop', name: 'balloon-blue', style: 'right:8cqh;bottom:12cqh;width:9cqh;height:12cqh' },
      ],
    },
  ],
});
