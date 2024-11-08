import userRegisterHandler from './user/userRegister.handler.js';
import userLoginHandler from './user/userLogin.handler.js';
import { matchHandler } from './game/match.handler.js';
import { PacketType } from '../constants/packetTypes.js';
import { monsterSpawnHandler } from './game/spawnMonster.handler.js';

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
  [PacketType.SPAWN_MONSTER_REQUEST]: {
    handler: monsterSpawnHandler,
    prototype: 'gamePacket.C2SSpawnMonsterRequest',
  },
  [PacketType.MONSTER_ATTACK_BASE_REQUEST]: {
    handler: null,
    prototype: 'gamePacket.C2SMonsterAttackBaseRequest',
  },
  [PacketType.TOWER_ATTACK_REQUEST]: {
    handler: null,
    prototype: 'gamePacket.C2STowerAttackRequest',
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
