import { v4 as uuidv4 } from 'uuid';
import { getGameSession } from '../../session/game.session.js';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/packetTypes.js';
import { createNotificationPacket } from '../../utils/notification/game.notification.js';
import { getUser } from '../../session/user.session.js';
let cnt = 1;
const monsterSpawnHandler = async (socket, payload) => {
  try {
    const currentUser = getUser(socket);
    const gameSession = getGameSession(currentUser);
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
      PacketType.SPAWN_MONSTER_RESPONSE,
    );

    socket.write(monsetSpawnResponse);

    opponent.socket.write(
      createNotificationPacket(
        monsterSpawnResponseData,
        PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION,
      ),
    );
  } catch (err) {
    console.error('몬스터 생성 중 에러 발생:', err);
    /*
    const errorResponse = createResponse(
      { spawnMonsterResponse: { success: false, message: 'Error spawning monster', failCode: 3 } },
      null,
      PacketType.SPAWN_MONSTER_RESPONSE,
    );
    socket.write(errorResponse);
    */
  }
};

export default monsterSpawnHandler;
