import initialGameState from './initialGameState.js';

class Game {
  constructor(user1, user2) {
    this.users = [user1, user2];

    this.baseHp = {
      [user1.socket]: initialGameState.baseHp,
      [user2.socket]: initialGameState.baseHp,
    };

    this.towerCost = initialGameState.towerCost;

    this.gold = {
      [user1.socket]: initialGameState.initialGold,
      [user2.socket]: initialGameState.initialGold,
    };

    this.monsterSpawnInterval = initialGameState.monsterSpawnInterval;

    this.topScore = {
      [user1.socket]: 0,
      [user2.socket]: 0,
    };

    this.score = {
      [user1.socket]: 0,
      [user2.socket]: 0,
    };

    this.monsterLevel = {
      [user1.socket]: 1,
      [user2.socket]: 1,
    };

    this.towers = {
      [user1.socket]: [],
      [user2.socket]: [],
    };

    this.monsters = {
      [user1.socket]: [],
      [user2.socket]: [],
    };

    this.monsterPath = {
      [user1.socket]: [],
      [user2.socket]: [],
    };

    this.basePosition = {
      [user1.socket]: { x: 0, y: 0 },
      [user2.socket]: { x: 0, y: 0 },
    };

    this.lastMonsterSpawn = {
      [user1.socket]: 0,
      [user2.socket]: 0,
    };
  }

  getInitialGameState() {
    return {
      baseHp: this.baseHp[this.users[0].socket],
      towerCost: this.towerCost,
      initialGold: this.gold[this.users[0].socket],
      monsterSpawnInterval: this.monsterSpawnInterval,
    };
  }
}
