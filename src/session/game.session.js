import Game from '../classes/models/game.class.js';
import { gameSessions, waitingQueue, inGameUsers, endGameQueue } from './sessions.js';

// 게임 세션 추가
export const addGameSession = (user1, user2) => {
  const session = new Game(user1, user2);
  gameSessions.push(session);

  return session;
};

// 게임 세션 제거
export const removeGameSessionbyUser = (user) => {
  const index = gameSessions.findIndex(
    (session) => session.users[0].id === user.id || session.users[1].id === user.id,
  );

  if (index !== -1) {
    const opponent = gameSessions[index].users.find((i) => i.id !== user.id);

    gameSessions[index].removeUser(user.socket);
    gameSessions[index].removeUser(opponent.socket);

    return gameSessions.splice(index, 1)[0];
  }
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

export const exitGameSession = (socket) => {
  const game = getGameSession(socket);
  game.removeUser(socket);

  const users = game.getUsers();
  if (users.length === 0) {
    removeGameSession(socket);
  }
};

// 게임 세션 조회
export const getGameSession = (socket) => {
  return gameSessions.find(
    (session) => session.users[0].socket === socket || session.users[1].socket === socket,
  );
};

// 게임 세션 조회
export const getGameSessionbyUser = (user) => {
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
