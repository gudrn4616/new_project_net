import { getUser } from '../../session/user.session.js';
import { getGameSession } from '../../session/game.session.js';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/packetTypes.js';

// 기지 체력 업데이트 알림 함수
const notifyBaseHealthUpdate = (currentUser, baseHealth) => {
  const responsePayload = {
    updateBaseHpNotification: {
      baseHealth: baseHealth,
    },
  };

  const response = createResponse(
    responsePayload,
    currentUser,
    PacketType.UPDATE_BASE_HP_NOTIFICATION,
  );

  console.log(`기지 체력 업데이트 알림 패킷 전송: ${response}`);

  currentUser.socket.write(response);
};

// 몬스터의 기지 공격 요청 처리 함수
export const monsterAttackBaseHandler = async (socket, packet) => {
  try {
    console.log('기지 공격 요청 처리 핸들러 호출됨');

    const currentUser = getUser(socket);
    if (!currentUser) {
      console.error('유저가 존재하지 않습니다.');
      return;
    }

    const game = getGameSession(currentUser);
    if (!game) {
      console.error('게임 세션이 존재하지 않습니다.');
      return;
    }

    // 수정 필요
    const { monsterId, damage } = packet.payload || {};
    const base = game.getBase();

    console.log(`기지 공격 요청 - Monster ID: ${monsterId}, Damage: ${damage}`);

    base.health -= damage;
    if (base.health < 0) base.health = 0;

    notifyBaseHealthUpdate(currentUser, base.health);
  } catch (err) {
    console.error('기지 공격 처리 중 에러 발생:', err);
  }
};
