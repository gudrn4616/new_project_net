import endGameHandler from '../handler/game/endGame.handler.js';
import {
  getEndGameQueue,
  getInGameUsers,
  getWaitingQueue,
  removeWaitingQueue,
} from '../session/game.session.js';
import { getUser, removeUser } from '../session/user.session.js';

export const onEnd = (socket) => async () => {
  const user = getUser(socket);

  if (getWaitingQueue().has(user)) {
    removeWaitingQueue(user);
  }

  if (getEndGameQueue().has(user) || getInGameUsers().has(user)) {
    const payload = { trigger: 1 };
    endGameHandler(socket, payload);
  }

  removeUser(socket);
};
