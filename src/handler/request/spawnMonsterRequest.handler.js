import { getGameSession } from '../../session/game.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getProtoTypeNameByHandlerId } from '../index.js';
import protobuf from 'protobufjs';

export default function spawnMonsterRequestHandler({ socket, userId, payload }) {
  // 고유한 몬스터 아이디 생성
  const monsterId = generateUniqueMonsterId(); // 고유 ID 생성 함수

  const gameSession = getGameSession(socket);
  if (!gameSession) {
    console.error(`No active game session found for user ${userId}`);
    return;
  }

  // 게임 세션에 몬스터 스폰 데이터 추가
  gameSession.addMonster({
    monsterId,
    monsterNumber: payload.monsterNumber,
  });

  // 스폰 몬스터 응답 생성
  handleMonsterSpawnResponse(socket, userId, monsterId);
}

function generateUniqueMonsterId() {
  return Math.floor(Math.random() * 1000000); // 예시로 임의의 숫자를 생성
}

function handleMonsterSpawnResponse(socket, userId, monsterId) {
  const protoTypeName = getProtoTypeNameByHandlerId(HANDLER_IDS.SPAWN_MONSTER_RESPONSE);
  const responseType = protobuf.lookupType(protoTypeName);

  const spawnMonsterResponse = {
    successCode: RESPONSE_SUCCESS_CODE,
    monsterId,
    monsterNumber: Math.floor(Math.random() * 5) + 1, // 몬스터 넘버는 서버가 결정
  };

  const messageBuffer = responseType.encode(spawnMonsterResponse).finish();

  socket.write(messageBuffer);

  console.log(`Sent S2CSpawnMonsterResponse to user ${userId}:`, spawnMonsterResponse);
}
