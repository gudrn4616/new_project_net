import { getGameSession } from '../../session/game.session.js';
import createResponse from '../../utils/response/createResponse.js';
import { createNotificationPacket } from '../../utils/notification/game.notification.js';
import { config } from '../../config/config.js';

const packetType = config.packet.type;

let cnt = 1;
const monsterSpawnHandler = async (socket, payload) => {
  try {
    const gameSession = getGameSession(socket);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션이 존재하지 않습니다.');
    }

    const user = gameSession.users.find((user) => user.socket === socket);
    if (!user) {
      throw new Error('유저가 존재하지 않습니다.');
    }

    const opponent = gameSession.users.find((user) => user.socket !== socket);
    if (!opponent) {
      throw new Error('상대 유저가 존재하지 않습니다.');
    }

    const randomMonsterNumber = Math.floor(Math.random() * 5) + 1;

    // 게임 세션에 몬스터 추가
    gameSession.addMonster(user, cnt, randomMonsterNumber, gameSession.monsterLevel[user.id]);

    const monsterSpawnResponseData = {
      monsterId: cnt++,
      monsterNumber: randomMonsterNumber,
    };

    const monsetSpawnResponse = await createResponse(
      monsterSpawnResponseData,
      user,
      packetType.SPAWN_MONSTER_RESPONSE,
    );

    socket.write(monsetSpawnResponse);

    opponent.socket.write(
      createNotificationPacket(
        monsterSpawnResponseData,
        packetType.SPAWN_ENEMY_MONSTER_NOTIFICATION,
        user.getSequence(),
      ),
    );
  } catch (err) {
    console.error('몬스터 생성 중 에러 발생:', err);
    
    const errorResponse = createResponse(
      { spawnMonsterResponse: { success: false, message: 'Error spawning monster', failCode: 3 } },
      null,
      packetType.SPAWN_MONSTER_RESPONSE,
    );
    socket.write(errorResponse);
  }
};

export default monsterSpawnHandler;
