import { getGameSession } from '../../session/game.session.js';
import stateSyncNotification from '../../utils/notification/stateSync.notification.js';

const stateSyncNotificationHandler = (user) => {
  try {
    const game = getGameSession(user.socket);
    if (!game) {
      throw new Error('게임 세션이 존재하지 않습니다.');
    }

    const notificationPacket = stateSyncNotification(game, user);
    user.socket.write(notificationPacket);
  } catch (err) {
    console.error('상태 동기화 핸들러 중 에러 발생:', err);
  }
};

export default stateSyncNotificationHandler;
