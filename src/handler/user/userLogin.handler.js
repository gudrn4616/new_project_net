import jwt from 'jsonwebtoken';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/packetTypes.js';
import { findUserById } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import { addUser } from '../../session/user.session.js';

const userLoginHandler = async (socket, payload) => {
  try {
    const id = payload.id;
    const password = payload.password;
    const user = await findUserById(id);

    console.log('login user:', user);
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
        null,
        PacketType.LOGIN_RESPONSE,
      );

      socket.write(errorResponse);
      return;
    }

    //todo: 암복호화 비교로 변경
    if (!(await bcrypt.compare(password, user.password))) {
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
        null,
        PacketType.LOGIN_RESPONSE,
      );

      socket.write(errorResponse);
      return;
    }

    const TEMP_SECRET_KEY = 'temporary_secret_key';

    const token = jwt.sign(user, TEMP_SECRET_KEY, { expiresIn: '24h' });
    const bearerToken = `Bearer ${token}`;

    const responsePayload = {
      success: true,
      message: '로그인 성공',
      token: bearerToken,
      failCode: 0,
    };

    const userSession = await addUser(socket, user);

    const response = createResponse(responsePayload, userSession, PacketType.LOGIN_RESPONSE);

    console.log('Sending response:', response);

    socket.write(response);
  } catch (err) {
    throw new Error(err);
  }
};

export default userLoginHandler;
