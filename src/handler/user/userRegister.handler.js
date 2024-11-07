import { createUser, findUserById } from '../../db/user/user.db.js';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';

// TODO: email 검증, id 길이 검증, password 암호화
const userRegisterHandler = async (socket, payload) => {
  try {
    const email = payload.email;
    const id = payload.id;
    const password = payload.password;

    const user = await findUserById(id);
    if (user) {
      // 회원가입 실패 - ID 중복
      const errorResponse = createResponse(
        {
          registerResponse: {
            success: false,
            message: 'register fail',
            failCode: 3,
          },
        },
        PacketType.REGISTER_RESPONSE,
      );
      console.log("createResponse 완료")
      socket.write(errorResponse);
      return;
    }

    console.log('createUser start');
    await createUser(email, id, password);
    console.log('회원가입 성공');

    const responsePayload = {
      registerResponse: {
        success: true,
        message: 'register success',
        failCode: 0,
      },
    };

    const response = createResponse(responsePayload, PacketType.REGISTER_RESPONSE);
    socket.write(response);
  } catch (err) {
    throw new Error(err);
  }
};

export default userRegisterHandler;
