import { getGameSession } from '../../session/game.session.js';
import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { getProtoTypeNameByHandlerId } from '../index.js';
import protobuf from 'protobufjs';

export default function updateBaseHPNotificationHandler({ socket, userId, isOpponent }) {
  // 세션 가져오기
  const session = getGameSession(socket);
  if (!session) {
    console.error(`No active game session found for user ${userId}`);
    return;
  }

  // 기지 체력 조회
  const baseHp = session.getBaseHealth();

  // 체력 업데이트 알림 전송
  sendBaseHpUpdateNotification(socket, isOpponent, baseHp);
}

function sendBaseHpUpdateNotification(socket, isOpponent, baseHp) {
  const protoTypeName = getProtoTypeNameByHandlerId(HANDLER_IDS.UPDATE_BASE_HP_NOTIFICATION);
  const responseType = protobuf.lookupType(protoTypeName);

  const baseHpUpdateNotification = {
    isOpponent,
    baseHp,
  };

  const messageBuffer = responseType.encode(baseHpUpdateNotification).finish();

  socket.write(messageBuffer);

  console.log(`Sent update base HP notification to client:`, baseHpUpdateNotification);
}
