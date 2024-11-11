import userRegisterHandler from './user/userRegister.handler.js';
import userLoginHandler from './user/userLogin.handler.js';
import towerAttackHandler from './tower/towerAttack.handler.js';
import monsterDeathHandler from './monster/monsterDeath.handler.js';
import monsterAttackBaseHandler from './game/baseAttackHandler.js';
import monsterSpawnHandler from './monster/spawnMonster.handler.js';
import towerPurchaseHandler from './tower/towerPurchase.handler.js';
import endGameHandler from './game/endGame.handler.js';
import matchHandler from './game/match.handler.js';
import { config } from '../config/config.js';

const packetType = config.packet.type;

const handlers = {
  [packetType.REGISTER_REQUEST]: {
    handler: userRegisterHandler,
    prototype: 'gamePacket.C2SRegisterRequest',
  },
  [packetType.LOGIN_REQUEST]: {
    handler: userLoginHandler,
    prototype: 'gamePacket.C2SLoginRequest',
  },
  [packetType.MATCH_REQUEST]: {
    handler: matchHandler,
    prototype: 'gamePacket.C2SMatchRequest',
  },
  [packetType.SPAWN_MONSTER_REQUEST]: {
    handler: monsterSpawnHandler,
    prototype: 'gamePacket.C2SSpawnMonsterRequest',
  },
  [packetType.MONSTER_ATTACK_BASE_REQUEST]: {
    handler: monsterAttackBaseHandler,
    prototype: 'gamePacket.C2SMonsterAttackBaseRequest',
  },
  [packetType.TOWER_ATTACK_REQUEST]: {
    handler: towerAttackHandler,
    prototype: 'gamePacket.C2STowerAttackRequest',
  },
  [packetType.MONSTER_DEATH_NOTIFICATION]: {
    handler: monsterDeathHandler,
    prototype: 'gamePacket.C2SMonsterDeathNotification',
  },
  [packetType.TOWER_PURCHASE_REQUEST]: {
    handler: towerPurchaseHandler,
    prototype: 'gamePacket.C2STowerPurchaseRequest',
  },
  [packetType.GAME_END_REQUEST]: {
    handler: endGameHandler,
    prototype: 'gamePacket.C2SGameEndRequest',
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
