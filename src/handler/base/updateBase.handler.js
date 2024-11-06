import { getGameSession } from '../../session/game.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const handleUpdateBase = ({ socket, userId, payload }) => {
  try {
    const { baseId, damage } = payload;
    const session = getGameSession(socket);

    if (!session) {
      throw new CustomError(ErrorCodes.SESSION_NOT_FOUND, 'Game session not found');
    }

    const base = session.getBase(baseId);
    if (!base) {
      throw new CustomError(ErrorCodes.BASE_NOT_FOUND, 'Base not found');
    }

    base.applyDamage(damage);

    const responseData = {
      type: 'BASE_UPDATED',
      baseId: baseId,
      remainingHealth: base.health,
    };

    socket.write(JSON.stringify(responseData));

    // 기지 상태 업데이트에 대한 알림을 모든 사용자에게 전송
    const notification = {
      type: 'BASE_HEALTH_UPDATE',
      baseId: baseId,
      remainingHealth: base.health,
    };

    session.users.forEach((user) => {
      user.socket.write(JSON.stringify(notification));
    });
  } catch (error) {
    console.error('Error handling base update:', error);
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, error.message);
  }
};

export default handleUpdateBase;
