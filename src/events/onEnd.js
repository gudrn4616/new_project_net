import { endGameHandler } from '../handler/game/match.handler.js';
import { removeUser } from '../session/user.session.js';
import { getUser } from '../session/user.session.js';
import {
  getWaitingQueue,
  removeWaitingQueue,
  getEndGameQueue,
  getInGameUsers,
} from '../session/game.session.js';
export const onEnd = (socket) => async () => {
  const user = getUser(socket);
  if (getWaitingQueue().has(user)) {
    removeWaitingQueue(user);
  }
  if (getEndGameQueue().has(user) || getInGameUsers().has(user)) {
    endGameHandler(socket, 1);
  }
  removeUser(socket);
};
