import { getUser } from '../../session/user.session.js';
import { getGameSession } from '../../session/game.session.js';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/packetTypes.js';

// 기지 체력 업데이트 알림 함수
const notificationBaseHealthUpdate = (user, baseHealth) => {
  const responsePayload = {
    updateBaseHpNotification: {
      baseHealth,
    },
  };

  const response = createResponse(responsePayload, user, PacketType.UPDATE_BASE_HP_NOTIFICATION);

  console.log(`기지 체력 업데이트 알림 패킷 전송: ${response}`);

  user.socket.write(response);
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

    const game = getGameSession(socket);
    if (!game) {
      console.error('게임 세션이 존재하지 않습니다.');
      return;
    }

    console.log('Received packet:', JSON.stringify(packet, null, 2)); // 디버깅용 패킷 전체 출력

    // 패킷의 속성 직접 확인
    const { damage } = packet; // packet.payload가 아니라 packet 자체에서 데이터 추출
    if (damage === undefined) {
      console.error(
        `Invalid packet: damage is missing. Packet: ${JSON.stringify(packet, null, 2)}`,
      );
      return;
    }

    console.log(`기지 공격 요청 - Damage: ${damage}`);

    const baseHp = game.baseHp[currentUser.socket];
    if (typeof baseHp === 'undefined') {
      console.error('기지 체력 정보를 찾을 수 없습니다.');
      return;
    }

    // 현재 사용자의 기지 체력 업데이트
    game.baseHp[currentUser.socket] -= damage;
    if (game.baseHp[currentUser.socket] < 0) game.baseHp[currentUser.socket] = 0;

    // 현재 유저에게 기지 체력 업데이트 알림 전송
    notificationBaseHealthUpdate(currentUser, game.baseHp[currentUser.socket]);

    // 상대 유저에게도 기지 체력 업데이트 알림 전송
    const opponent = game.users.find((user) => user.socket !== currentUser.socket);
    if (opponent) {
      notificationBaseHealthUpdate(opponent, game.baseHp[currentUser.socket]);
    }
  } catch (err) {
    console.error('기지 공격 처리 중 에러 발생:', err);
  }
};
