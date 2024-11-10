import { getUser } from '../../session/user.session.js';
import { addGameSession, getAllGameSession, getGameSession } from '../../session/game.session.js';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/packetTypes.js';
import {
  getWaitingQueue,
  addWaitingQueue,
  removeWaitingQueue,
  getInGameUsers,
  addInGameUser,
  removeInGameUser,
  getEndGameQueue,
  addEndGameQueue,
  removeEndGameQueue,
} from '../../session/game.session.js';

export const matchHandler = async (socket, data) => {
  // 현재 유저 가져오기
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
  console.log('매칭 대기열:', getWaitingQueue());

  // 매칭 대기열에 2명 이상이면 게임 매칭 시작
  if (getWaitingQueue().size >= 2) {
    // 대기열에서 첫 번째 유저와 두 번째 유저를 가져옴
    const [user1, user2] = getWaitingQueue();

    // 두 유저를 대기열에서 제거하고 게임 중 목록에 추가
    removeWaitingQueue(user1, user2);
    addInGameUser(user1, user2);

    // 게임 인스턴스 생성
    let game = getGameSession(socket);
    if (!game) {
      game = addGameSession(user1, user2);
    }

    game.addTower(user1, 1, 900, 300);
    game.addTower(user2, 2, 900, 300);

    const responsePayload1 = {
      initialGameState: game.getInitialGameState(),
      playerData: game.getGameState(user1),
      opponentData: game.getGameState(user2),
    };

    /*
    console.log('=================');
    console.log('게임 세션 수: ', getAllGameSession.length);
    console.log('게임 세션: ', game);
    console.log('User1: =', game.getGameState(user1));
    console.log('User2: =', game.getGameState(user2));
    console.log('=================');
    */

    const responsePayload2 = {
      initialGameState: game.getInitialGameState(),
      playerData: game.getGameState(user2),
      opponentData: game.getGameState(user1),
    };

    const response1 = createResponse(responsePayload1, user1, PacketType.MATCH_START_NOTIFICATION);
    const response2 = createResponse(responsePayload2, user2, PacketType.MATCH_START_NOTIFICATION);
    user1.socket.write(response1);
    user2.socket.write(response2);
    return;
  }

  return null;
};

// 게임 종료 처리
export const endGameHandler = (socket) => {
  const currentUser = getUser(socket);
  if (!currentUser) return;

  const gameSession = getGameSession(currentUser);
  if (!gameSession) return;

  const opponent = gameSession.users.find((user) => user.id !== currentUser.id);
  addEndGameQueue(currentUser);
  let endGameQueue = getEndGameQueue();

  if (endGameQueue.has(currentUser) && endGameQueue.has(opponent)) {
    const currentUserHp = gameSession.baseHp[currentUser.id];
    const opponentHp = gameSession.baseHp[opponent.id];
    const isCurrentUserWin = opponentHp <= 0;
    const isOpponentWin = currentUserHp <= 0;

    [currentUser, opponent].forEach((user) => {
      if (getInGameUsers().has(user)) removeInGameUser(user);
      removeEndGameQueue(user);
    });

    removeGameSession(currentUser);

    const responses = [currentUser, opponent].map((user, index) => {
      const isWin = index === 0 ? isCurrentUserWin : isOpponentWin;
      return createResponse({ isWin }, user, PacketType.C2SGameEndRequest);
    });

    currentUser.socket.write(responses[0]);
    opponent.socket.write(responses[1]);
  }
};
