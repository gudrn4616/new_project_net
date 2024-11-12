import { getUser } from '../../session/user.session.js';
import { addGameSession, getGameSession } from '../../session/game.session.js';
import createResponse from '../../utils/response/createResponse.js';
import {
  getWaitingQueue,
  addWaitingQueue,
  removeWaitingQueue,
  getInGameUsers,
  addInGameUser,
} from '../../session/game.session.js';
import { config } from '../../config/config.js';

const packetType = config.packet.type;

const matchHandler = async (socket) => {
  console.log('매칭 요청:');
  const currentUser = getUser(socket);
  if (!currentUser) {
    console.error('유저가 존재하지 않습니다.');
    return;
  }

  // 이미 게임 중이거나 매칭 대기 중인 경우 처리하지 않음
  if (getInGameUsers().has(currentUser) || getWaitingQueue().has(currentUser)) {
    return;
  }

  // 현재 유저를 매칭 대기열에 추가
  addWaitingQueue(currentUser);
  console.log(
    '매칭 대기열:',
    Array.from(getWaitingQueue()).map((user) => user.id),
  );

  // 매칭 대기열에 2명 이상이면 게임 매칭 시작
  if (getWaitingQueue().size >= 2) {
    // 대기열에서 첫 번째 유저와 두 번째 유저를 가져옴
    const [user1, user2] = getWaitingQueue();

    // 두 유저를 대기열에서 제거하고 게임 중 목록에 추가
    removeWaitingQueue(user1, user2);
    addInGameUser(user1, user2);

    let game = getGameSession(socket) || addGameSession(user1, user2);

    const towers = [
      { user: user1, id: 1, x: 700, y: 300 },
      { user: user1, id: 2, x: 1100, y: 300 },
      { user: user2, id: 3, x: 700, y: 300 },
      { user: user2, id: 4, x: 900, y: 300 },
    ];

    towers.forEach(({ user, id, x, y }) => game.addTower(user, id, x, y));

    const createPayload = (player, opponent) => ({
      initialGameState: game.getInitialGameState(),
      playerData: game.getGameState(player),
      opponentData: game.getGameState(opponent),
    });

    const response1 = createResponse(
      createPayload(user1, user2),
      user1,
      packetType.MATCH_START_NOTIFICATION,
    );
    const response2 = createResponse(
      createPayload(user2, user1),
      user2,
      packetType.MATCH_START_NOTIFICATION,
    );

    user1.socket.write(response1);
    user2.socket.write(response2);
  }

  return null;
};

export default matchHandler;
