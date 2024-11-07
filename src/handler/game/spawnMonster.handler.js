import { getGameSession } from '../../session/game.session.js';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/packetTypes.js';
import {
  createSpawnEnemyMonsterPacket,
  createSpawnMonsterPacket,
} from '../../utils/notification/game.notification.js';

// 몬스터 스폰 알림 함수
export const notificationMonsterSpawn = (currentUser, monster) => {
  const responsePayload = {
    spawnNotification: {
      monsterId: monster.id,
      monsterNumber: monster.number,
      monsterType: monster.type,
      monsterLevel: monster.level,
    },
  };

  const response = createResponse(responsePayload, currentUser, PacketType.S2CSpawnMonsterResponse);

  console.log(`몬스터 스폰 알림 패킷 전송: ${response}`);

  currentUser.socket.write(response);
};

let cnt = 1;

export const monsterSpawnHandler = async (socket, payload) => {
  try {
    const gameSession = getGameSession(socket);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션이 존재하지 않습니다.');
    }

    const opponent = gameSession.users.find((user) => user.socket !== socket);
    if (!opponent) {
      throw new Error('상대 유저가 존재하지 않습니다.');
    }

    const randomMonsterId = Math.floor(Math.random() * 5) + 1;

    const monsterSpawnResponse = {
      monsterId: cnt++,
      monsterNumber: randomMonsterId,
    };
    //
    Promise.all([
      socket.write(createSpawnMonsterPacket(monsterSpawnResponse)),
      opponent.socket.write(createSpawnEnemyMonsterPacket(monsterSpawnResponse)),
    ]);
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
