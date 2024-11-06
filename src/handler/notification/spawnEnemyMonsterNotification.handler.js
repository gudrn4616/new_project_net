import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { getProtoTypeNameByHandlerId } from '../index.js';
import protobuf from 'protobufjs';

export default function spawnEnemyMonsterNotificationHandler({ socket, monster }) {
  // 필요한 몬스터 데이터를 가져오기
  const { id, number } = monster;

  // 몬스터 스폰 알림 생성
  sendSpawnEnemyMonsterNotification(socket, id, number);
}

// 몬스터 스폰 알림 전송 함수
function sendSpawnEnemyMonsterNotification(socket, monsterId, monsterNumber) {
  const protoTypeName = getProtoTypeNameByHandlerId(HANDLER_IDS.SPAWN_ENEMY_MONSTER_NOTIFICATION);
  const responseType = protobuf.lookupType(protoTypeName);

  const spawnEnemyMonsterNotification = {
    monsterId,
    monsterNumber,
  };

  const messageBuffer = responseType.encode(spawnEnemyMonsterNotification).finish();

  socket.write(messageBuffer);

  console.log(`Sent spawn enemy monster notification to client:`, spawnEnemyMonsterNotification);
}
