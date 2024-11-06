import Game from '../classes/models/game.classes.js';
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

// 게임 세션에 몬스터 추가
export const addMonsterToSession = (socket, monster) => {
  const session = getGameSession(socket);
  if (session) {
    session.monsters.push(monster);
  }
};

// 게임 세션에서 몬스터 삭제
export const removeMonsterFromSession = (socket, monsterId) => {
  const session = getGameSession(socket);
  if (session) {
    const index = session.monsters.findIndex((monster) => monster.id === monsterId);
    if (index !== -1) {
      return session.monsters.splice(index, 1)[0];
    }
  }
};

// 기지 체력 감소
export const reduceBaseHealthInSession = (socket, damage) => {
  const session = getGameSession(socket);
  if (session) {
    session.reduceBaseHealth(damage);
    return session.getBaseHealth();
  }
  return null;
};
