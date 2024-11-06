import jwt from 'jsonwebtoken';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { findUserById } from '../../db/user/user.db.js';

// TODO: DB에서 유저 확인 후 비밀번호 체크
const userLoginHandler = async (socket, payload) => {
  try {
    const { id, password } = payload.loginRequest;
    const user = await findUserById(id);

    if (!user) {
      console.error(`${id} 유저가 존재하지 않습니다.`);
      const errorResponse = createResponse(
        {
          loginResponse: {
            success: false,
            message: '유저가 존재하지 않습니다.',
            token: '',
            failCode: 3,
          },
        },
        PacketType.LOGIN_RESPONSE,
      );
      socket.write(errorResponse);
      return;
    }

    if (user.password !== password) {
      // NOTE: 비밀번호 틀림
      console.error(`${socket}: 비밀번호가 틀렸습니다.`);
      const errorResponse = createResponse(
        {
          loginResponse: {
            success: false,
            message: '비밀번호가 틀렸습니다.',
            token: '',
            failCode: 3,
          },
        },
        PacketType.LOGIN_RESPONSE,
      );
      socket.write(errorResponse);
      return;
    }

    // WARN: env에 추가해서 env.js와 config.js를 통해 관리할 것
    const TEMP_SECRET_KEY = 'temporary_secret_key';

    const token = jwt.sign(user, TEMP_SECRET_KEY, { expiresIn: '1h' });
    const bearerToken = `Bearer ${token}`;

    const responsePayload = {
      loginResponse: {
        success: true,
        message: '로그인 성공',
        token: bearerToken,
        failCode: 0,
      },
    };

    const response = createResponse(responsePayload, PacketType.LOGIN_RESPONSE);
    socket.write(response);
  } catch (err) {
    throw new Error(err);
  }
};

export default userLoginHandler;
