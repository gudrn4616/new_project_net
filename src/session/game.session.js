// sessionManager.js
import Game from '../class/models/game.class.js';
import Monster from '../class/models/monster.class.js';
import Base from '../class/models/base.class.js';
import { gameSessions } from './sessions.js';

// 게임 세션 추가
export const addGameSession = (user1, user2) => {
  const session = new Game(user1, user2);
  gameSessions.push(session);
  return session;
};

// 게임 세션 제거
export const removeGameSession = (socket) => {
  const index = gameSessions.findIndex(
    (session) => session.users[0].socket === socket || session.users[1].socket === socket,
  );
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

// 게임 세션 조회
export const getGameSession = (socket) => {
  return gameSessions.find(
    (session) => session.users[0].socket === socket || session.users[1].socket === socket,
  );
};

// 몬스터 추가
export const addMonsterToSession = (socket, monsterData) => {
  const session = getGameSession(socket);
  if (session) {
    const { id, name, health, attack } = monsterData;
    const newMonster = new Monster(id, name, health, attack);
    session.addMonster(newMonster);
    return newMonster;
  } else {
    throw new Error('Game session not found');
  }
};

// 몬스터 제거
export const removeMonsterFromSession = (socket, monsterId) => {
  const session = getGameSession(socket);
  if (session) {
    session.removeMonster(monsterId);
  }
  return session;
};

// 몬스터 조회
export const getMonsterFromSession = (socket, monsterId) => {
  const session = getGameSession(socket);
  if (session) {
    return session.getMonster(monsterId);
  }
  return null;
};

// 기지 추가
export const addBaseToSession = (socket, baseData) => {
  const session = getGameSession(socket);
  if (session) {
    const { id, name, health } = baseData;
    const newBase = new Base(id, name, health);
    session.addBase(newBase);
    return newBase;
  } else {
    throw new Error('Game session not found');
  }
};

// 기지 조회
export const getBaseFromSession = (socket, baseId) => {
  const session = getGameSession(socket);
  if (session) {
    return session.getBase(baseId);
  }
  return null;
};
