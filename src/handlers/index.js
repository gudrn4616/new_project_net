import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { config } from '../config/config.js';
import registerHandler from './user/register.handler.js';

const { handlerIds } = config;

const handlers = {
  [handlerIds.register]: {
    handler: registerHandler,
    protoType: 'sign.C2SRegisterRequest',
  },
  [handlerIds.login]: {
    handler: null,
    protoType: 'sign.C2SLoginRequest',
  },
};

/**
 * Id로 핸들러 불러오기
 * @param {*} handlerId
 * @returns
 */
export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }

  return handlers[handlerId].handler;
};

/**
 * Id로 프로토타입 불러오기
 * @param {*} handlerId
 * @returns
 */
export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }

  return handlers[handlerId].protoType;
};
