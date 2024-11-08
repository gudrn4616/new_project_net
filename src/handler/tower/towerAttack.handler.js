import { PacketType } from '../../constants/packetTypes.js';
import { getGameSession } from '../../session/game.session.js';
import { getUser } from '../../session/user.session.js';
import { createNotificationPacket } from '../../utils/notification/game.notification.js';

const towerAttackHandler = (socket, payload) => {
  try {
    const { towerId, monsterId } = payload;

    const user = getUser(socket);
    if (!user) {
      throw new Error('유저가 존재하지 않습니다.');
    }

    const game = getGameSession(socket);
    if (!game) {
      throw new Error('게임 세션이 존재하지 않습니다.');
    }

    const tower = game.getTower(socket, towerId);
    if (!tower) {
      throw new Error('해당 타워가 존재하지 않습니다.');
    }

    const monster = game.getMonster(socket, monsterId);
    if (!monster) {
      throw new Error('해당 몬스터가 존재하지 않습니다.');
    }

    const opponent = game.users.find((user) => user.socket !== socket);
    if (!opponent) {
      throw new Error('상대 유저가 존재하지 않습니다.');
    }

    const towerAttackData = {
      towerId: towerId,
      monsterId: monsterId,
    };

    opponent.socket.write(
      createNotificationPacket(towerAttackData, PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION),
    );
  } catch (err) {
    console.error('타워 공격 중 에러 발생:', err);
  }
};

export default towerAttackHandler;