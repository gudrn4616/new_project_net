import { getUser } from '../../session/user.session.js';

export const matchHandler = (socket, data) => {
  const user = getUser(socket);
  if (!user) {
    return;
  }
  const randomUser = randomUser();
  const game = new Game(user, randomUser);
};
