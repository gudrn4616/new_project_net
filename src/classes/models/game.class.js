import { initialGameState, playerData } from '../../asset/initialGameState.js';
import Monster from './monster.class.js';

class Game {
  constructor(user1, user2) {
    this.users = [user1, user2];

    this.baseHp = {
      [user1.socket]: playerData.base.hp,
      [user2.socket]: playerData.base.hp,
    };

    this.towerCost = initialGameState.towerCost;

    this.gold = {
      [user1.socket]: playerData.gold,
      [user2.socket]: playerData.gold,
    };

    this.monsterSpawnInterval = initialGameState.monsterSpawnInterval;

    this.topScore = {
      [user1.socket]: playerData.highScore,
      [user2.socket]: playerData.highScore,
    };

    this.score = {
      [user1.socket]: playerData.score,
      [user2.socket]: playerData.score,
    };

    this.monsterLevel = {
      [user1.socket]: playerData.monsterLevel,
      [user2.socket]: playerData.monsterLevel,
    };

    this.towers = {
      [user1.socket]: [...playerData.towers],
      [user2.socket]: [...playerData.towers],
    };

    this.monsters = {
      [user1.socket]: [],
      [user2.socket]: [],
    };

    this.monsterPath = {
      [user1.socket]: [...playerData.monsterPath],
      [user2.socket]: [...playerData.monsterPath],
    };

    this.basePosition = {
      [user1.socket]: { ...playerData.basePosition },
      [user2.socket]: { ...playerData.basePosition },
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

  getGameState(user) {
    return {
      userGold: this.gold[user.socket],
      base: { hp: this.baseHp[user.socket], maxHp: playerData.base.maxHp },
      highScore: this.topScore[user.socket],
      towers: this.towers[user.socket] != null ? [...this.towers[user.socket]] : null,
      monsters: this.monsters[user.socket] != null ? [...this.monsters[user.socket]] : null,
      monsterLevel: this.monsterLevel[user.socket],
      score: this.score[user.socket],
      monsterPath:
        this.monsterPath[user.socket] != null ? [...this.monsterPath[user.socket]] : null,
      basePosition: this.basePosition[user.socket],
    };
  }

  getTower(socket, towerId) {
    const towers = this.towers[socket];

    if (towers) {
      return towers.find((tower) => tower.towerId === towerId) || null;
    }

    return null;
  }

  addMonster(socket, id, number, level) {
    const newMonster = new Monster(socket, id, number, level);
    this.monsters[socket].push(newMonster);
  }

  getMonster(socket, monsterId) {
    const monsters = this.monsters[socket];
    if (monsters) {
      return monsters.find((monster) => monster.id === monsterId) || null;
    }

    return null;
  }
}

export default Game;
