import { HANDLER_IDS } from '../constants/handlerIds.js';
import updateBaseHandler from './base/updateBase.handler.js';
import monsterAttackHandler from './monster/monsterAttack.handler.js';
import monsterSpawnHandler from './monster/monsterSpawn.handler.js';

const handlers = {
  [HANDLER_IDS.MONSTER_SPAWN]: {
    handler: monsterSpawnHandler,
    protoType: 'request.C2SSpawnMonsterRequest',
  },
  [HANDLER_IDS.MONSTER_ATTACK]: {
    handler: monsterAttackHandler,
    protoType: 'request.C2SMonsterAttackBaseRequest',
  },
  [HANDLER_IDS.UPDATE_BASE]: {
    handler: updateBaseHandler,
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
