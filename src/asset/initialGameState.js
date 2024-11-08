// 초기 게임 상태 설정
export const initialGameState = {
  baseHp: 100,
  towerCost: 100,
  initialGold: 5000,
  monsterSpawnInterval: 5000,
};

export const playerData = {
  gold: initialGameState.initialGold,
  base: {
    hp: initialGameState.baseHp,
    maxHp: initialGameState.baseHp,
  },
  highScore: 0,
  towers: [
    { towerId: 1, x: 900.0, y: 300.0 },
    { towerId: 2, x: 1100.0, y: 300.0 },
  ],
  monsters: [],
  monsterLevel: 1,
  score: 0,
  monsterPath: [
    { x: 0, y: 300 },
    { x: 100, y: 300 },
    { x: 200, y: 300 },
    { x: 300, y: 300 },
    { x: 400, y: 300 },
    { x: 500, y: 300 },
    { x: 600, y: 300 },
    { x: 700, y: 300 },
    { x: 800, y: 300 },
    { x: 900, y: 300 },
    { x: 1000, y: 300 },
    { x: 1100, y: 300 },
    { x: 1200, y: 300 },
    { x: 1300, y: 300 },
  ],
  basePosition: { x: 1350.0, y: 300.0 },
};
