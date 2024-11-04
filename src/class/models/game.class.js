class Game {
  constructor(user1, user2) {
    this.users = [user1, user2];
    this.isGameStart = false;

    // 초기 게임 상태 설정
    const initialGameState = {
      baseHp: 100,
      towerCost: 100,
      initialGold: 5000,
      monsterSpawnInterval: 5000,
    };

    this.baseHp = {
      [user1.id]: initialGameState.baseHp,
      [user2.id]: initialGameState.baseHp,
    };

    this.towerCost = initialGameState.towerCost;

    this.gold = {
      [user1.id]: initialGameState.initialGold,
      [user2.id]: initialGameState.initialGold,
    };

    this.monsterSpawnInterval = initialGameState.monsterSpawnInterval;

    this.topScore = {
      [user1.id]: 0,
      [user2.id]: 0,
    };

    this.score = {
      [user1.id]: 0,
      [user2.id]: 0,
    };

    this.monsterLevel = {
      [user1.id]: 1,
      [user2.id]: 1,
    };

    this.towers = {
      [user1.id]: [],
      [user2.id]: [],
    };

    this.monsters = {
      [user1.id]: [],
      [user2.id]: [],
    };

    this.monsterPath = {
      [user1.id]: [],
      [user2.id]: [],
    };

    this.basePosition = {
      [user1.id]: { x: 0, y: 0 },
      [user2.id]: { x: 0, y: 0 },
    };

    this.lastMonsterSpawn = {
      [user1.id]: 0,
      [user2.id]: 0,
    };
  }

  getInitialGameState() {
    return {
      baseHp: this.baseHp[this.users[0].id],
      towerCost: this.towerCost,
      initialGold: this.gold[this.users[0].id],
      monsterSpawnInterval: this.monsterSpawnInterval,
    };
  }
}
