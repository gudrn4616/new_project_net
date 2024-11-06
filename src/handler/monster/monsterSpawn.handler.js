import { addMonsterToSession } from './sessionManager.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

export const handleCreateMonster = ({ socket, userId, payload }) => {
  try {
    const { monsterData } = payload;
    const newMonster = addMonsterToSession(socket, monsterData);

    const responseData = {
      type: 'MONSTER_CREATED',
      monsterId: newMonster.id,
    };

    // 클라이언트에 성공 응답 전송
    socket.write(JSON.stringify(responseData));
  } catch (error) {
    console.error('Error creating monster:', error);
    // 예외를 CustomError로 처리하여 에러 코드와 함께 전달
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, error);
  }
};

export default handleCreateMonster;
