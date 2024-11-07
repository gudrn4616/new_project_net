import userRegisterHandler from './user/userRegister.handler.js';
import userLoginHandler from './user/userLogin.handler.js';
import { endGameHandler, matchHandler } from './game/match.handler.js';
import spawnMonsterRequestHandler from './request/spawnMonsterRequest.handler.js';
import spawnMonsterResponseHandler from './response/spawnMonsterResponse.handler.js';
import spawnEnemyMonsterNotificationHandler from './notification/spawnEnemyMonsterNotification.handler.js';
import monsterAttackBaseRequestHandler from './request/monsterAttackBaseRequest.handler.js';
import updateBaseHPNotificationHandler from './notification/updateBaseHPNotification.handler.js';
import { PacketType } from '../constants/PacketTypes.js';

const handlers = {
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
  [PacketType.SPAWN_MONSTER_REQUEST]: {
    handler: spawnMonsterRequestHandler,
    protoType: 'request.C2SSpawnMonsterRequest',
  },
  [PacketType.SPAWN_MONSTER_RESPONSE]: {
    handler: spawnMonsterResponseHandler,
    protoType: 'response.S2CSpawnMonsterResponse',
  },
  [PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION]: {
    handler: spawnEnemyMonsterNotificationHandler,
    protoType: 'notification.S2CSpawnEnemyMonsterNotification',
  },
  [PacketType.MONSTER_ATTACK_BASE_REQUEST]: {
    handler: monsterAttackBaseRequestHandler,
    protoType: 'request.C2SMonsterAttackBaseRequest',
  },
  [PacketType.UPDATE_BASE_HP_NOTIFICATION]: {
    handler: updateBaseHPNotificationHandler,
    protoType: 'notification.S2CUpdateBaseHPNotification',
  },
};

export const getHandlerByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    throw new Error(`핸들러를 찾을 수 없습니다: ID ${packetType}`);
  }
  return handlers[packetType].handler;
};

export const getProtoTypeNameByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    throw new Error(`핸들러를 찾을 수 없습니다: ID ${packetType}`);
  }
  return handlers[packetType].prototype;
};
