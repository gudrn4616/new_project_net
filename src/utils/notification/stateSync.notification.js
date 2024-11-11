import { PacketType } from '../../constants/packetTypes.js';
import { createNotificationPacket } from './game.notification.js';

const stateSyncNotification = (game, user) => {
  try {
    /*
    message S2CStateSyncNotification {
      int32 userGold = 1;
      int32 baseHp = 2;
      int32 monsterLevel = 3;
      int32 score = 4;
      repeated TowerData towers = 5;
      repeated MonsterData monsters = 6;
    }
    */

    const payload = game.getStateSync(user);

    console.log('=============');
    console.log(`user: ${user.id} - payload: ${JSON.stringify(payload.towers, null, 2)}`);
    console.log('상태 동기화!');
    console.log('=============');

    return createNotificationPacket(
      payload,
      PacketType.STATE_SYNC_NOTIFICATION,
      user.getSequence(),
    );
  } catch (err) {
    console.error('상태 동기화 중 에러 발생:', err);
  }
};

export default stateSyncNotification;
