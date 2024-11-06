import { getGameSession, reduceBaseHealthInSession } from '../../session/game.session.js';
import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { getProtoTypeNameByHandlerId } from '../index.js';
import protobuf from 'protobufjs';
import updateBaseHPNotificationHandler from '../notification/updateBaseHPNotification.handler.js';

export default function monsterAttackBaseRequestHandler({ socket, userId, payload }) {
  // 세션에서 기지 체력 감소
  const newBaseHealth = reduceBaseHealthInSession(socket, payload.damage);
  if (newBaseHealth === null) {
    console.error(`No active game session found for user ${userId}`);
    return;
  }

  // 기지 체력 업데이트 알림 생성 (본인에게)
  sendBaseHealthUpdate(socket, newBaseHealth);

  // 상대방 소켓 가져오기
  const session = getGameSession(socket);
  const opponentSocket = session.users.find((user) => user.socket !== socket).socket;

  // 상대에게 알림 전송
  updateBaseHPNotificationHandler({ socket: opponentSocket, userId, isOpponent: true });
}

function sendBaseHealthUpdate(socket, baseHealth) {
  const protoTypeName = getProtoTypeNameByHandlerId(HANDLER_IDS.UPDATE_BASE_HP_NOTIFICATION);
  const responseType = protobuf.lookupType(protoTypeName);

  const baseHealthNotification = {
    baseHealth,
  };

  const messageBuffer = responseType.encode(baseHealthNotification).finish();

  socket.write(messageBuffer);

  console.log(`Sent update base notification to client:`, baseHealthNotification);
}
