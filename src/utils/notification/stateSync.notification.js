import { config } from '../../config/config.js';
import { createNotificationPacket } from './game.notification.js';

const packetType = config.packet.type;

const stateSyncNotification = (game, user) => {
  try {
    const payload = game.getStateSync(user);

    return createNotificationPacket(
      payload,
      packetType.STATE_SYNC_NOTIFICATION,
      user.getSequence(),
    );
  } catch (err) {
    console.error('상태 동기화 중 에러 발생:', err);
  }
};

export default stateSyncNotification;
