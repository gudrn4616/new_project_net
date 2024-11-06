import initialGameState from './initialGameState.js';

class Game {
  constructor(user1, user2) {
    this.users = [user1, user2];
    this.monsters = [];
    this.baseHealth = initialGameState.baseHp;

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

  // 몬스터 추가
  addMonster(monster) {
    this.monsters.push(monster);
  }

  // 특정 몬스터 제거
  removeMonster(monsterId) {
    const index = this.monsters.findIndex((monster) => monster.id === monsterId);
    if (index !== -1) {
      this.monsters.splice(index, 1);
    }
  }

  // 모든 몬스터 조회
  getMonsters() {
    return this.monsters;
  }

  // 기지 체력 감소 메서드
  reduceBaseHealth(amount) {
    this.baseHealth = Math.max(0, this.baseHealth - amount);
  }

  // 기지 체력 조회 메서드
  getBaseHealth() {
    return this.baseHealth;
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

export default Game;
