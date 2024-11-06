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
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new Error(`핸들러를 찾을 수 없습니다: ID ${handlerId}`);
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new Error(`핸들러를 찾을 수 없습니다: ID ${handlerId}`);
  }
  return handlers[handlerId].prototype;
};
