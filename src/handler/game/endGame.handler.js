import { config } from '../../config/config.js';
import { createWOL, findWOLById, updateWOL } from '../../db/game/wol.db.js';
import {
  addEndGameQueue,
  getEndGameQueue,
  getGameSessionbyUser,
  getInGameUsers,
  removeEndGameQueue,
  removeGameSessionbyUser,
  removeInGameUser,
} from '../../session/game.session.js';
import { getUser } from '../../session/user.session.js';
import { createNotificationPacket } from '../../utils/notification/game.notification.js';

const packetType = config.packet.type;

// 게임 종료 처리
const endGameHandler = async (socket, payload) => {
  const trigger = payload.trigger || 0;

  const currentUser = getUser(socket);
  if (!currentUser) return;

  const gameSession = getGameSessionbyUser(currentUser);
  if (!gameSession) return;

  const opponent = gameSession.users.find((user) => user.id !== currentUser.id);

  addEndGameQueue(currentUser);
  addEndGameQueue(opponent);

  const endGameQueue = getEndGameQueue();

  if (endGameQueue.has(currentUser) && endGameQueue.has(opponent)) {
    const currentUserHp = gameSession.baseHp[currentUser.id];
    const opponentHp = gameSession.baseHp[opponent.id];
    const isCurrentUserWin = trigger === 0 ? opponentHp <= 0 : false;
    const isOpponentWin = trigger === 0 ? currentUserHp <= 0 : true;

    [currentUser, opponent].forEach((user) => {
      if (getInGameUsers().has(user)) removeInGameUser(user);
      removeEndGameQueue(user);
    });

    removeGameSessionbyUser(currentUser);

    [currentUser, opponent].forEach((user, index) => {
      const isWin = index === 0 ? isCurrentUserWin : isOpponentWin;
      const response = createNotificationPacket(
        { isWin },
        packetType.GAME_OVER_NOTIFICATION,
        user.getSequence(),
      );
      user.socket.write(response);
    });

    // 게임 결과 기록
    const [currentUserWOL, opponentWOL] = await Promise.all([
      findWOLById(currentUser.id) ||
        createWOL(currentUser.id, 0, 0).then(() => ({ victory_count: 0, defeat_count: 0 })),
      findWOLById(opponent.id) ||
        createWOL(opponent.id, 0, 0).then(() => ({ victory_count: 0, defeat_count: 0 })),
    ]);

    if (isCurrentUserWin) {
      await Promise.all([
        updateWOL(currentUser.id, currentUserWOL.victory_count + 1, currentUserWOL.defeat_count),
        updateWOL(opponent.id, opponentWOL.victory_count, opponentWOL.defeat_count + 1),
      ]);
    } else if (isOpponentWin) {
      await Promise.all([
        updateWOL(currentUser.id, currentUserWOL.victory_count, currentUserWOL.defeat_count + 1),
        updateWOL(opponent.id, opponentWOL.victory_count + 1, opponentWOL.defeat_count),
      ]);
    }
  }
};

export default endGameHandler;
