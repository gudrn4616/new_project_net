import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import { getUser } from '../../session/user.session.js';
import { createNotificationPacket } from '../../utils/notification/game.notification.js';
import createResponse from '../../utils/response/createResponse.js';

const packetType = config.packet.type;

let tmpId = 5;
const towerPurchaseHandler = async (socket, payload) => {
  try {
    const { x, y } = payload;

    const game = getGameSession(socket);
    if (!game) {
      throw new Error('게임 세션이 존재하지 않습니다.');
    }

    const user = getUser(socket);
    if (!user) {
      throw new Error('유저가 존재하지 않습니다.');
    }

    const opponent = game.users.find((user) => user.socket !== socket);
    if (!opponent) {
      throw new Error('상대 유저가 존재하지 않습니다.');
    }

    const existTowerUser = game.getTower(user, tmpId);
    const existTowerOpponent = game.getTower(opponent, tmpId);
    if (existTowerUser || existTowerOpponent) {
      throw new Error('이미 존재하는 타워입니다.');
    }

    await game.addTower(user, tmpId, x, y);
    const tower = await game.getTower(user, tmpId++);

    game.gold[user.id] -= 3000;

    const notificationData = { towerId: tower.id, x, y };
    const addEnemyTowerNotification = createNotificationPacket(
      notificationData,
      packetType.ADD_ENEMY_TOWER_NOTIFICATION,
      opponent.getSequence(),
    );
    opponent.socket.write(addEnemyTowerNotification);

    const responseData = { towerId: tower.id };
    const towerPurchaseResponse = createResponse(
      responseData,
      user,
      packetType.TOWER_PURCHASE_RESPONSE,
    );
    socket.write(towerPurchaseResponse);
  } catch (err) {
    console.error('타워 구매 중 에러 발생:', err);
  }
};

export default towerPurchaseHandler;
