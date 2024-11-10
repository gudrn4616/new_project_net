import Game from '../classes/models/game.class.js';
import { gameSessions, waitingQueue, inGameUsers, endGameQueue } from './sessions.js';

// 게임 세션 추가
export const addGameSession = (user1, user2) => {
  const session = new Game(user1, user2);
  gameSessions.push(session);

  return session;
};

// 게임 세션 제거
export const removeGameSession = (user) => {
  const index = gameSessions.findIndex(
    (session) => session.users[0].id === user.id || session.users[1].id === user.id,
  );
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

// 게임 세션 조회
export const getGameSession = (user) => {
  return gameSessions.find(
    (session) => session.users[0].id === user.id || session.users[1].id === user.id,
  );
};

export const getAllGameSession = () => {
  return gameSessions;
};

export const getWaitingQueue = () => {
  return waitingQueue;
};

export const addWaitingQueue = (user) => {
  waitingQueue.add(user);
};

export const removeWaitingQueue = (user1, user2) => {
  waitingQueue.delete(user1);
  waitingQueue.delete(user2);
};

export const getInGameUsers = () => {
  return inGameUsers;
};

export const addInGameUser = (user1, user2) => {
  inGameUsers.add(user1);
  inGameUsers.add(user2);
};

export const removeInGameUser = (user) => {
  inGameUsers.delete(user);
};

export const getEndGameQueue = () => {
  return endGameQueue;
};

export const addEndGameQueue = (user) => {
  endGameQueue.add(user);
};

export const removeEndGameQueue = (user) => {
  endGameQueue.delete(user);
};
