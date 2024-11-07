import { getUser } from '../../session/user.session.js';
import { getGameSession } from '../../session/game.session.js';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/PacketTypes.js';
import { addMonster } from '../../session/monster.session.js';

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

export const monsterSpawnHandler = async (socket, packet) => {
  try {
    console.log('몬스터 생성 응답 핸들러 호출됨');

    const currentUser = getUser(socket);
    if (!currentUser) {
      console.error('유저가 존재하지 않습니다.');
      const errorResponse = createResponse(
        { spawnMonsterResponse: { success: false, message: 'User not found', failCode: 1 } },
        null,
        PacketType.SPAWN_MONSTER_RESPONSE,
      );
      socket.write(errorResponse);
      return;
    }

    const game = getGameSession(currentUser);
    if (!game) {
      console.error('게임 세션이 존재하지 않습니다.');
      const errorResponse = createResponse(
        {
          spawnMonsterResponse: { success: false, message: 'Game session not found', failCode: 2 },
        },
        null,
        PacketType.SPAWN_MONSTER_RESPONSE,
      );
      socket.write(errorResponse);
      return;
    }

    const { monsterType = 'default', monsterLevel = 1 } = packet.payload || {};
    console.log(`몬스터 생성 요청 - Type: ${monsterType}, Level: ${monsterLevel}`);

    const monster = game.spawnMonster(currentUser, monsterType, monsterLevel);
    console.log(`몬스터 생성 완료 - ID: ${monster.id}, Number: ${monster.number}`);

    // 몬스터 세션에 추가
    addMonster(socket, monster.id, monster.number, monsterLevel);

    const responsePayload = {
      spawnMonsterResponse: {
        success: true,
        monsterId: monster.id,
        monsterNumber: monster.number,
      },
    };

    const response = createResponse(
      responsePayload,
      currentUser,
      PacketType.SPAWN_MONSTER_RESPONSE,
    );
    console.log(`몬스터 생성 응답 패킷 전송: ${response}`);

    socket.write(response);

    // 몬스터 스폰 알림 전송
    notificationMonsterSpawn(currentUser, monster);
  } catch (err) {
    console.error('몬스터 생성 중 에러 발생:', err);
    const errorResponse = createResponse(
      { spawnMonsterResponse: { success: false, message: 'Error spawning monster', failCode: 3 } },
      null,
      PacketType.SPAWN_MONSTER_RESPONSE,
    );
    socket.write(errorResponse);
  }
};
