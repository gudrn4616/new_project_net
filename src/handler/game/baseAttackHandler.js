import { getUser } from '../../session/user.session.js';
import { getGameSession } from '../../session/game.session.js';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/packetTypes.js';

// 몬스터의 기지 공격 요청 처리 함수
const monsterAttackBaseHandler = async (socket, packet) => {
  try {
    const currentUser = getUser(socket);
    if (!currentUser) {
      console.error('유저가 존재하지 않습니다.');
      return;
    }

    const game = getGameSession(socket);
    if (!game) {
      console.error('게임 세션이 존재하지 않습니다.');
      return;
    }

    // 패킷의 속성 직접 확인
    const { damage } = packet;
    if (!damage) {
      console.error(
        `Invalid packet: damage is missing. Packet: ${JSON.stringify(packet, null, 2)}`,
      );
      return;
    }

    const baseHp = game.baseHp[currentUser.socket];
    if (typeof baseHp === 'undefined') {
      console.error('기지 체력 정보를 찾을 수 없습니다.');
      return;
    }

    // 현재 사용자의 기지 체력 업데이트
    game.baseHp[currentUser.socket] -= damage;
    if (game.baseHp[currentUser.socket] < 0) game.baseHp[currentUser.socket] = 0;

    // 현재 유저에게 기지 체력 업데이트 알림 전송
    notificationBaseHealthUpdate(currentUser, game.baseHp[currentUser.socket], false);

    // 상대 유저에게도 기지 체력 업데이트 알림 전송
    const opponent = game.users.find((user) => user.socket !== currentUser.socket);
    if (opponent) {
      notificationBaseHealthUpdate(opponent, game.baseHp[currentUser.socket], true);
    }
  } catch (err) {
    console.error('기지 공격 처리 중 에러 발생:', err);
  }
};

// 기지 체력 업데이트 알림 함수
const notificationBaseHealthUpdate = (user, baseHealth, isOpponent) => {
  const responsePayload = {
    isOpponent: isOpponent,
    baseHp: baseHealth,
  };

  const response = createResponse(responsePayload, user, PacketType.UPDATE_BASE_HP_NOTIFICATION);

  // 피아식별 구분
  user.socket.write(response);
};

export default monsterAttackBaseHandler;
