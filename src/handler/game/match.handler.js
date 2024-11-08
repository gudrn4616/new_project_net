import { getUser } from '../../session/user.session.js';
import { addGameSession } from '../../session/game.session.js';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/packetTypes.js';

// 매칭 대기열을 저장할 Set
const waitingQueue = new Set();
// 게임 중인 유저를 저장할 Set
const inGameUsers = new Set();
// 게임 종료 대기열을 저장할 Set
const endGameQueue = new Set();

// Initial Game State
const initialGameState = {
  baseHp: 100,
  towerCost: 100,
  initialGold: 5000,
  monsterSpawnInterval: 5000,
};

/*
message GameState {
  int32 gold = 1;
  BaseData base = 2;
  int32 highScore = 3;
  repeated TowerData towers = 4;
  repeated MonsterData monsters = 5;
  int32 monsterLevel = 6;
  int32 score = 7;
  repeated Position monsterPath = 8;
  Position basePosition = 9;
}
*/
// GameState - player
const playerData = {
  gold: initialGameState.initialGold,
  base: {
    hp: initialGameState.baseHp,
    maxHp: initialGameState.baseHp,
  },
  highScore: 0,
  towers: [
    { towerId: 1, x: 900.0, y: 300.0 },
    { towerId: 2, x: 1100.0, y: 300.0 },
  ],
  monsters: [],
  monsterLevel: 1,
  score: 0,
  monsterPath: [
    { x: 0, y: 300 },
    { x: 100, y: 300 },
    { x: 200, y: 300 },
    { x: 300, y: 300 },
    { x: 400, y: 300 },
    { x: 500, y: 300 },
    { x: 600, y: 300 },
    { x: 700, y: 300 },
    { x: 800, y: 300 },
    { x: 900, y: 300 },
    { x: 1000, y: 300 },
    { x: 1100, y: 300 },
    { x: 1200, y: 300 },
    { x: 1300, y: 300 },
  ],
  basePosition: { x: 1350.0, y: 300.0 },
};

// GameState - opponent
const opponentData = {
  gold: initialGameState.initialGold,
  base: {
    hp: initialGameState.baseHp,
    maxHp: initialGameState.baseHp,
  },
  highScore: 0,
  towers: [
    { towerId: 1, x: 900.0, y: 300.0 },
    { towerId: 2, x: 1100.0, y: 300.0 },
  ],
  monsters: [],
  monsterLevel: 1,
  score: 0,
  monsterPath: [
    { x: 0, y: 300 },
    { x: 100, y: 300 },
    { x: 200, y: 300 },
    { x: 300, y: 300 },
    { x: 400, y: 300 },
    { x: 500, y: 300 },
    { x: 600, y: 300 },
    { x: 700, y: 300 },
    { x: 800, y: 300 },
    { x: 900, y: 300 },
    { x: 1000, y: 300 },
    { x: 1100, y: 300 },
    { x: 1200, y: 300 },
    { x: 1300, y: 300 },
  ],
  basePosition: { x: 1350.0, y: 300.0 },
};

export const matchHandler = async (socket, data) => {
  // 현재 유저 가져오기
  console.log('매칭 요청:');
  const currentUser = getUser(socket);
  if (!currentUser) {
    console.error('유저가 존재하지 않습니다.');
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

    const responsePayload1 = {
      initialGameState: initialGameState,
      playerData: playerData,
      opponentData: opponentData,
    };

    const responsePayload2 = {
      initialGameState: initialGameState,
      playerData: opponentData,
      opponentData: playerData,
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
  /*
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
    const responsePayload1 = {
      C2SGameEndRequest: {
        isWin: isCurrentUserWin,
      },
    };
    const responsePayload2 = {
      C2SGameEndRequest: {
        isWin: !isCurrentUserWin,
      },
    };
    const response1 = createResponse(responsePayload1, PacketType.C2SGameEndRequest);
    const response2 = createResponse(responsePayload2, PacketType.C2SGameEndRequest);
    currentUser.socket.write(response1);
    opponent.socket.write(response2);
  }
  */
};
