import { getGameSession } from '../session/game.session.js';

export const onEnd = (socket) => async () => {
  const gameSession = getGameSession(socket);
  if (!gameSession) {
    throw new Error('해당 유저의 게임 세션이 존재하지 않습니다.');
  }

  const user = gameSession.users.find((user) => user.socket === socket);
  if (!user) {
    throw new Error('유저가 존재하지 않습니다.');
  }

  // interval 종료하기
};
