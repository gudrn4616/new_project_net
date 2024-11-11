import { PacketType } from '../../constants/packetTypes.js';
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

// 게임 종료 처리
export const endGameHandler = async (socket, trigger = 0) => {
  const currentUser = getUser(socket);
  if (!currentUser) return;

  const gameSession = getGameSessionbyUser(currentUser);
  if (!gameSession) return;

  const opponent = gameSession.users.find((user) => user.id !== currentUser.id);

  addEndGameQueue(currentUser);
  addEndGameQueue(opponent);

  let endGameQueue = getEndGameQueue();

  if (endGameQueue.has(currentUser) && endGameQueue.has(opponent)) {
    let isCurrentUserWin, isOpponentWin;

    if (trigger === 0) {
      const currentUserHp = gameSession.baseHp[currentUser.id];
      const opponentHp = gameSession.baseHp[opponent.id];
      isCurrentUserWin = opponentHp <= 0;
      isOpponentWin = currentUserHp <= 0;
    } else if (trigger === 1) {
      isCurrentUserWin = false;
      isOpponentWin = true;
    }

    [currentUser, opponent].forEach((user) => {
      if (getInGameUsers().has(user)) removeInGameUser(user);
      removeEndGameQueue(user);
    });

    removeGameSessionbyUser(currentUser);

    const responses = [currentUser, opponent].map((user, index) => {
      const isWin = index === 0 ? isCurrentUserWin : isOpponentWin;
      return createNotificationPacket(
        { isWin },
        PacketType.GAME_OVER_NOTIFICATION,
        user.getSequence(),
      );
    });

    currentUser.socket.write(responses[0]);
    opponent.socket.write(responses[1]);

    // 게임 결과 기록
    let currentUserWOL = await findWOLById(currentUser.id);
    let opponentWOL = await findWOLById(opponent.id);

    if (!currentUserWOL) {
      await createWOL(currentUser.id, 0, 0);
      currentUserWOL = { victory_count: 0, defeat_count: 0 };
    }
    if (!opponentWOL) {
      await createWOL(opponent.id, 0, 0);
      opponentWOL = { victory_count: 0, defeat_count: 0 };
    }

    if (isCurrentUserWin) {
      await updateWOL(
        currentUser.id,
        currentUserWOL.victory_count + 1,
        currentUserWOL.defeat_count,
      );
      await updateWOL(opponent.id, opponentWOL.victory_count, opponentWOL.defeat_count + 1);
    } else if (isOpponentWin) {
      await updateWOL(
        currentUser.id,
        currentUserWOL.victory_count,
        currentUserWOL.defeat_count + 1,
      );
      await updateWOL(opponent.id, opponentWOL.victory_count + 1, opponentWOL.defeat_count);
    }
  }
};
