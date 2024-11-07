import userRegisterHandler from './user/userRegister.handler.js';
import userLoginHandler from './user/userLogin.handler.js';
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
    handler: () => {},
    prototype: 'gamePacket.C2SMatchRequest',
  },
  [PacketType.MATCH_START_NOTIFICATION]: {
    handler: () => {},
    prototype: 'gamePacket.S2CMatchStartNotification',
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
