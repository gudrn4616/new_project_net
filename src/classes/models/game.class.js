import { initialGameState, playerData } from '../../asset/initialGameState.js';
import stateSyncNotificationHandler from '../../handler/stateSync/stateSyncNotification.handler.js';
import IntervalManager from '../managers/interval.manager.js';
import Monster from './monster.class.js';
import Tower from './tower.class.js';

class Game {
  constructor(user1, user2) {
    this.intervalManager = new IntervalManager();

    const user1Id = user1.id;
    const user2Id = user2.id;

    this.users = [user1, user2];

    this.baseHp = {
      [user1Id]: playerData.base.hp,
      [user2Id]: playerData.base.hp,
    };

    this.towerCost = initialGameState.towerCost;

    this.gold = {
      [user1Id]: playerData.gold,
      [user2Id]: playerData.gold,
    };

    this.monsterSpawnInterval = initialGameState.monsterSpawnInterval;

    this.topScore = {
      [user1Id]: playerData.highScore,
      [user2Id]: playerData.highScore,
    };

    this.score = {
      [user1Id]: playerData.score,
      [user2Id]: playerData.score,
    };

    this.monsterLevel = {
      [user1Id]: playerData.monsterLevel,
      [user2Id]: playerData.monsterLevel,
    };

    this.towers = {
      [user1Id]: [],
      [user2Id]: [],
    };

    this.monsters = {
      [user1Id]: [],
      [user2Id]: [],
    };

    this.monsterPath = {
      [user1Id]: [...playerData.monsterPath],
      [user2Id]: [...playerData.monsterPath],
    };

    this.basePosition = {
      [user1Id]: { ...playerData.basePosition },
      [user2Id]: { ...playerData.basePosition },
    };

    this.lastMonsterSpawn = {
      [user1Id]: 0,
      [user2Id]: 0,
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

  getGameState(user) {
    return {
      userGold: this.gold[user.id],
      base: { hp: this.baseHp[user.id], maxHp: playerData.base.maxHp },
      highScore: this.topScore[user.id],
      towers: this.towers[user.id] != null ? [...this.towers[user.id]] : null,
      monsters: this.monsters[user.id] != null ? [...this.monsters[user.id]] : null,
      monsterLevel: this.monsterLevel[user.id],
      score: this.score[user.id],
      monsterPath: this.monsterPath[user.id] != null ? [...this.monsterPath[user.id]] : null,
      basePosition: this.basePosition[user.id],
    };
  }

  getTower(user, towerId) {
    const towers = this.towers[user.id];

    if (towers) {
      return towers.find((tower) => tower.towerId === towerId) || null;
    }

    return null;
  }

  addTower(user, id, x, y) {
    const newTower = new Tower(user.socket, id, x, y);
    this.towers[user.id].push({ towerId: newTower.id, x: newTower.x, y: newTower.y });
  }

  getMonster(user, monsterId) {
    const monsters = this.monsters[user.id];
    if (monsters) {
      return monsters.find((monster) => monster.monsterId === monsterId) || null;
    }

    return null;
  }

  addMonster(user, id, number, level) {
    const newMonster = new Monster(user.socket, id, number, level);
    this.monsters[user.id].push({
      monsterId: newMonster.id,
      monsterNumber: newMonster.number,
      level: newMonster.level,
    });
  }

  removeMonster(user, monsterId) {
    this.monsters[user.id] = this.monsters[user.id].filter(
      (monster) => monster.monsterId !== monsterId,
    );
  }

  stateSync() {
    this.users.forEach((user) => {
      const interval = 1000;

      this.intervalManager.addUser(
        user.id,
        () => stateSyncNotificationHandler(user),
        interval,
        'user',
      );
    });
  }
}

export default Game;
