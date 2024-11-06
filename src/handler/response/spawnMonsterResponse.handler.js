import _ from 'lodash';
import { packetNames } from '../../protobuf/packetNames.js';
import protobuf from 'protobufjs';
import { getGameSession } from '../../session/game.session.js';

export default function spawnMonsterResponseHandler({ socket, userId, payload }) {
  // 고유한 몬스터 아이디 생성 (이미 payload에 포함된 경우도 있음)
  const monsterId = payload.monsterId; // 클라이언트에서 전달받음

  // 1~5 사이의 랜덤한 number 생성
  const monsterNumber = _.random(1, 5);

  // 프로토 메시지 생성
  const spawnMonsterResponse = {
    monsterId,
    monsterNumber,
  };

  // 현재 사용자의 게임 세션을 가져옵니다.
  const gameSession = getGameSession(socket);
  if (!gameSession) {
    console.error(`No active game session found for user ${userId}`);
    return;
  }

  // 게임 세션에 몬스터 데이터를 추가합니다.
  gameSession.addMonster({
    monsterId,
    monsterNumber,
  });

  // 응답 메시지를 인코딩
  const protoTypeName = packetNames.response.spawnMonsterResponse;
  const responseType = protobuf.lookupType(protoTypeName);
  const messageBuffer = responseType.encode(spawnMonsterResponse).finish();

  // 클라이언트에 응답 전송
  socket.write(messageBuffer);

  console.log(`Sent S2CSpawnMonsterResponse to user ${userId}:`, spawnMonsterResponse);
}
