import initialGameState from './initialGameState.js';
import Monster from './monster.class.js';

class Game {
  constructor(user1, user2) {
    this.users = [user1, user2];
    this.monsters = [];
    this.bases = [];

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

  addMonster(monster) {
    if (monster instanceof Monster) {
      this.monsters.push(monster);
    } else {
      throw new Error('Invalid monster object');
    }
  }

  removeMonster(monsterId) {
    this.monsters = this.monsters.filter((monster) => monster.id !== monsterId);
  }

  getMonster(monsterId) {
    return this.monsters.find((monster) => monster.id === monsterId);
  }

  addBase(base) {
    this.bases.push(base);
  }

  getBase(baseId) {
    return this.bases.find((base) => base.id === baseId);
  }
}

export default Game;
