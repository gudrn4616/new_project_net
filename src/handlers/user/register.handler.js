import joiUtils from '../../utils/joi/joiUtils.js';
import { createUser, findUserById } from '../../db/user/user.db.js';

const registerHandler = async ({ socket, payload, sequence }) => {
  try {
    const { email, id, password } = await joiUtils.validateRegister(payload);

    const existUser = await findUserById(id);
    if (existUser) {
      const responsePayload = {
        success: false,
        message: '이미 존재하는 유저 ID입니다.',
        failCode: 3,
      };

      const S2CRegisterResponse = createResponse(PacketType.REGISTER_RESPONSE, responsePayload);
      socket.write(S2CRegisterResponse);

      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '이미 존재하는 ID');
    }

    /*
    const registerResponse = createResponse(HANDLER_IDS.INITIAL, RESPONSE_SUCCESS_CODE, {
      userId: deviceId,
      x: user.x,
      y: user.y,
    });

    // 소켓을 통해 초기화 응답 메시지 전송
    socket.write(registerResponse);
    */
  } catch (err) {
    console.error(err);
  }
};

export default registerHandler;
