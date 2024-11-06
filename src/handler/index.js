import { PacketType } from '../constants/header.js';
import userLoginHandler from './user/userLogin.handler.js';
import userRegisterHandler from './user/userRegister.handler.js';

const handlers = {
  [PacketType.REGISTER_REQUEST]: {
    handler: userRegisterHandler,
  },
  [PacketType.LOGIN_REQUEST]: {
    handler: userLoginHandler,
  },
};

export const getHandlerByPacketType = (packetType) => {

  if (!handlers[packetType]) {
    throw new Error();
  }

  return handlers[packetType].handler;
};
