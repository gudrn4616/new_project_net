import { PacketType } from '../../constants/packetTypes.js';
import { getGameSession } from '../../session/game.session.js';
import { getUser } from '../../session/user.session.js';
import { createNotificationPacket } from '../../utils/notification/game.notification.js';

const monsterDeathHandler = (socket, payload) => {
  try {
    const { monsterId } = payload;

    const game = getGameSession(socket);
    if (!game) {
      throw new Error('게임 세션이 존재하지 않습니다.');
    }

    const user = getUser(socket);
    if (!user) {
      throw new Error('유저가 존재하지 않습니다.');
    }

    const opponent = game.users.find((user) => user.socket !== socket);
    if (!opponent) {
      throw new Error('상대 유저가 존재하지 않습니다.');
    }

    const monster = game.getMonster(user, monsterId);
    if (!monster) {
      console.warn(`Warning: 몬스터 ${monsterId}가 이미 제거되었거나 존재하지 않습니다.`);
      return;
    }

    game.removeMonster(user, monsterId);

    const enemyMonsterDeathPayload = {
      monsterId: monsterId,
    };

    const notification = createNotificationPacket(
      enemyMonsterDeathPayload,
      PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION,
    );

    opponent.socket.write(notification);
  } catch (err) {
    console.error('몬스터 사망 중 에러 발생:', err);
  }
};

export default monsterDeathHandler;
