import { HANDLER_IDS } from '../constants/handlerIds.js';

const handlers = {
  [HANDLER_IDS.REGISTER_REQUEST]: {
    handler: () => {},
    prototype: 'gamePacket.C2SRegisterRequest',
  },
  [HANDLER_IDS.LOGIN_REQUEST]: {
    handler: () => {},
    prototype: 'gamePacket.C2SLoginRequest',
  },
  [HANDLER_IDS.MATCH_REQUEST]: {
    handler: () => {},
    prototype: 'gamePacket.C2SMatchRequest',
  },
  [HANDLER_IDS.MATCH_START_NOTIFICATION]: {
    handler: () => {},
    prototype: 'gamePacket.S2CMatchStartNotification',
  },
  [PacketType.REGISTER_REQUEST]: {
    handler: userRegisterHandler,
    prototype: 'gamePacket.C2SRegisterRequest',
  },
  [PacketType.LOGIN_REQUEST]: {
    handler: userLoginHandler,
    prototype: 'gamePacket.C2SLoginRequest',
  },
  [PacketType.MATCH_REQUEST]: {
    handler: matchHandler,
    prototype: 'gamePacket.C2SMatchRequest',
  },
  [PacketType.MATCH_START_NOTIFICATION]: {
    handler: endGameHandler,
    prototype: 'gamePacket.S2CMatchStartNotification',
  },
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
