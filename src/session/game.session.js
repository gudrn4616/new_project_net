import Game from '../classes/models/game.class.js';
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
