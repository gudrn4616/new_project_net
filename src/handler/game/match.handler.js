import { getUser } from '../../session/user.session.js';
import { addGameSession, removeGameSession, getGameSession } from '../../session/game.session.js';

// 매칭 대기열을 저장할 Set
const waitingQueue = new Set();
// 게임 중인 유저를 저장할 Set
const inGameUsers = new Set();
// 게임 종료 대기열을 저장할 Set
const endGameQueue = new Set();

export const matchHandler = (socket, data) => {
  // 현재 유저 가져오기
  const currentUser = getUser(socket);
  if (!currentUser) {
    return;
  }

  // 이미 게임 중이거나 매칭 대기 중인 경우 처리하지 않음
  if (inGameUsers.has(currentUser) || waitingQueue.has(currentUser)) {
    return;
  }

  // 현재 유저를 매칭 대기열에 추가
  waitingQueue.add(currentUser);

  // 매칭 대기열에 2명 이상이면 게임 매칭 시작
  if (waitingQueue.size >= 2) {
    // 대기열에서 첫 번째 유저와 두 번째 유저를 가져옴
    const [user1, user2] = waitingQueue;

    // 두 유저를 대기열에서 제거하고 게임 중 목록에 추가
    waitingQueue.delete(user1);
    waitingQueue.delete(user2);
    inGameUsers.add(user1);
    inGameUsers.add(user2);

    // 게임 인스턴스 생성
    const game = addGameSession(user1, user2);
    let user1InitialGameState = game.getInitialGameState();
    let user2InitialGameState = game.getInitialGameState();
    const responsePayload1 = {
      InitialGameState: user1InitialGameState,
    };
    /*
    const user1Packet = createMatchRequest(user1, user1InitialGameState);
    const user2Packet = createMatchRequest(user2, user2InitialGameState);
    user1.socket.write(user1Packet);
    user2.socket.write(user2Packet);
    */
    return;
  }

  return null;
};

// 게임 종료 처리
export const endGameHandler = (socket) => {
  const currentUser = getUser(socket);
  if (!currentUser) {
    return;
  }

  // 게임 세션 가져오기
  const gameSession = getGameSession(socket);
  if (!gameSession) {
    return;
  }
  // 게임 세션에서 상대방 찾기
  const opponent = gameSession.users.find((user) => user.socket !== socket);
  endGameQueue.add(currentUser);
  if (endGameQueue.has(currentUser) && endGameQueue.has(opponent)) {
    // 승패 결정
    const currentUserHp = gameSession.baseHp[currentUser.socket];
    const opponentHp = gameSession.baseHp[opponent.socket];

    if (currentUserHp === 0) isCurrentUserWin = true;
    else if (opponentHp === 0) isCurrentUserWin = false;

    // 게임 중인 유저 목록에서 제거
    if (inGameUsers.has(currentUser)) {
      inGameUsers.delete(currentUser);
    }

    // 상대방도 게임 중인 유저 목록에서 제거
    if (opponent && inGameUsers.has(opponent)) {
      inGameUsers.delete(opponent);
    }

    // 게임 세션 제거
    removeGameSession(socket);
    endGameQueue.delete(currentUser);
    endGameQueue.delete(opponent);

    // 게임 종료 패킷 생성 및 전송
    const packet = createGameEndRequest(currentUser.socket, { isWin: isCurrentUserWin });
    const opponentPacket = createGameEndRequest(opponent.socket, { isWin: !isCurrentUserWin });
    currentUser.socket.write(packet);
    opponent.socket.write(opponentPacket);
  }
};
