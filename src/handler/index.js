import { HANDLER_IDS } from '../constants/handlerIds.js';
// 기존 핸들러들
import spawnMonsterRequestHandler from './request/spawnMonsterRequest.handler.js';
import spawnMonsterResponseHandler from './response/spawnMonsterResponse.handler.js';
import spawnEnemyMonsterNotificationHandler from './notification/spawnEnemyMonsterNotification.handler.js';
import monsterAttackBaseRequestHandler from './request/monsterAttackBaseRequest.handler.js';
import updateBaseHPNotificationHandler from './notification/updateBaseHPNotification.handler.js';

const handlers = {
  [HANDLER_IDS.SPAWN_MONSTER_REQUEST]: {
    handler: spawnMonsterRequestHandler,
    protoType: 'request.C2SSpawnMonsterRequest',
  },
  [HANDLER_IDS.SPAWN_MONSTER_RESPONSE]: {
    handler: spawnMonsterResponseHandler,
    protoType: 'response.S2CSpawnMonsterResponse',
  },
  [HANDLER_IDS.SPAWN_ENEMY_MONSTER_NOTIFICATION]: {
    handler: spawnEnemyMonsterNotificationHandler,
    protoType: 'notification.S2CSpawnEnemyMonsterNotification',
  },
  [HANDLER_IDS.MONSTER_ATTACK_BASE_REQUEST]: {
    handler: monsterAttackBaseRequestHandler,
    protoType: 'request.C2SMonsterAttackBaseRequest',
  },
  [HANDLER_IDS.UPDATE_BASE_HP_NOTIFICATION]: {
    handler: updateBaseHPNotificationHandler,
    protoType: 'notification.S2CUpdateBaseHPNotification',
  },
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new Error(`Handler ID ${handlerId} not found`);
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new Error(`Handler ID ${handlerId} not found`);
  }
  return handlers[handlerId].protoType;
};
