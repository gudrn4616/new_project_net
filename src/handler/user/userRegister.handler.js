import { createUser, findUserById } from '../../db/user/user.db.js';
import createResponse from '../../utils/response/createResponse.js';
import joiUtils from '../../utils/joi/joi.js';
import { config } from '../../config/config.js';

const packetType = config.packet.type;

// TODO: email 검증, id 길이 검증, password 암호화
const userRegisterHandler = async (socket, payload) => {
  try {
    const { email, id, password } = await joiUtils.validateRegister(payload);
    console.log(`Payload received - email: ${email}, id: ${id}, password: ${password}`);

    const user = await findUserById(id);
    console.log(`User found: ${user}`);

    if (user) {
      // 회원가입 실패 - ID 중복
      const errorResponse = createResponse(
        {
          success: false,
          message: 'register fail',
          failCode: 3,
        },
        null,
        packetType.REGISTER_RESPONSE,
      );
      console.log(`Error response created: ${errorResponse}`);

      socket.write(errorResponse);
      return;
    }

    console.log('createUser start');
    await createUser(email, id, password);
    console.log('회원가입 성공');

    const responsePayload = {
      success: true,
      message: 'register success',
      failCode: 0,
    };

    const response = createResponse(responsePayload, null, packetType.REGISTER_RESPONSE);
    console.log(`Success response created: ${response}`);

    socket.write(response);
  } catch (err) {
    console.error(err); // Error 로그 추가
    throw new Error(err);
  }
};

export default userRegisterHandler;
