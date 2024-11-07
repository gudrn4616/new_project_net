import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

export const addUser = (socket, id, playerId, latency) => {
  const user = new User(socket, id, playerId, latency);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getAllUsers = () => {
  return userSessions;
};

export const getUser = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};

export const randomUser = () => {
  return userSessions[Math.floor(Math.random() * userSessions.length)];
};
