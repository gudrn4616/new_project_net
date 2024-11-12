import jwt from 'jsonwebtoken';
import createResponse from '../../utils/response/createResponse.js';
import { findUserById } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import { addUser } from '../../session/user.session.js';
import { getAllUsers } from '../../session/user.session.js';
import { config } from '../../config/config.js';

const packetType = config.packet.type;

const userLoginHandler = async (socket, payload) => {
  try {
    const id = payload.id;
    const password = payload.password;
    const user = await findUserById(id);

    //console.log('login user:', user);
    if (!user) {
      console.error(`${id} 유저가 존재하지 않습니다.`);
      const errorResponse = createResponse(
        {
          success: false,
          message: '유저가 존재하지 않습니다.',
          token: '',
          failCode: 3,
        },
        null,
        packetType.LOGIN_RESPONSE,
      );

      socket.write(errorResponse);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      console.error(`${socket}: 비밀번호가 틀렸습니다.`);
      const errorResponse = createResponse(
        {
          success: false,
          message: '비밀번호가 틀렸습니다.',
          token: '',
          failCode: 3,
        },
        null,
        packetType.LOGIN_RESPONSE,
      );

      socket.write(errorResponse);
      return;
    }

    const findId = user.user_id;
    const userList = getAllUsers().map((user) => user.playerId);
    const isLoginStatus = userList.includes(findId);

    if (isLoginStatus) {
      console.error(`"${findId}" 회원은 이미 로그인 상태입니다.`);
      const errorResponse = createResponse(
        {
          success: false,
          message: '사용중인 아이디입니다.',
          token: '',
          failCode: 3,
        },
        null,
        packetType.LOGIN_RESPONSE,
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

    const userSession = await addUser(socket, user.account_id, user.user_id, 0);

    const response = createResponse(responsePayload, userSession, packetType.LOGIN_RESPONSE);

    //console.log('Sending response:', response);

    socket.write(response);
  } catch (err) {
    throw new Error(err);
  }
};

export default userLoginHandler;
