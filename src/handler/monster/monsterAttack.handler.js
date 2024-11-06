// handlers/monsterAttackHandler.js
import { getGameSession } from '../../session/game.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const handleMonsterAttack = ({ socket, userId, payload }) => {
  try {
    const { monsterId, baseId, damage } = payload;
    const session = getGameSession(socket);

    if (!session) {
      throw new CustomError(ErrorCodes.SESSION_NOT_FOUND, 'Game session not found');
    }

    const monster = session.getMonster(monsterId);
    if (!monster) {
      throw new CustomError(ErrorCodes.MONSTER_NOT_FOUND, 'Monster not found');
    }

    const base = session.getBase(baseId);
    if (!base) {
      throw new CustomError(ErrorCodes.BASE_NOT_FOUND, 'Base not found');
    }

    base.applyDamage(damage);

    const responseData = {
      type: 'MONSTER_ATTACK',
      monsterId: monsterId,
      baseId: baseId,
      remainingHealth: base.health,
    };

    // 클라이언트에 성공 응답 전송
    socket.write(JSON.stringify(responseData));
  } catch (error) {
    console.error('Error handling monster attack:', error);
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, error);
  }
};

export default handleMonsterAttack;
