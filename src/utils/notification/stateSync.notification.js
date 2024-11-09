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

    const userGold = game.gold[user.id];
    const baseHp = game.baseHp[user.id];
    const monsterLevel = game.monsterLevel[user.id];
    const score = game.score[user.id];
    const towers = game.towers[user.id];
    const monsters = game.monsters[user.id];

    const payload = { userGold, baseHp, monsterLevel, score, towers, monsters };

    return createNotificationPacket(payload, PacketType.STATE_SYNC_NOTIFICATION);
  } catch (err) {
    console.error('상태 동기화 중 에러 발생:', err);
  }
};

export default stateSyncNotification;
