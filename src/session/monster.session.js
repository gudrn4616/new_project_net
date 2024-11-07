import { monsterSessions } from './sessions.js';
import Monster from '../classes/models/monster.class.js';

export const addMonster = (socket, id, number, level) => {
  const monster = new Monster(socket, id, number, level);
  monsterSessions.push(monster);
  return monster;
};

export const removeMonster = (socket) => {
  const index = monsterSessions.findIndex((monster) => monster.socket === socket);

  if (index !== -1) {
    return monsterSessions.splice(index, 1)[0];
  }
};

export const getAllMonsterBySocket = (socket) => {
  return monsterSessions.filter((monster) => monster.socket === socket);
};

export const getMonsterByMonsterId = (monsterId) => {
  return monsterSessions.find((monster) => monster.id === monsterId);
};
