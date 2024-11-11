import { exitGameSession } from '../session/game.session.js';

export const onEnd = (socket) => async () => {
  exitGameSession(socket);
};
