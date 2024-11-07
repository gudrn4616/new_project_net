import pools from '../database.js';
import { SQL_QUERIES } from './user.query.js';
import bcrypt from 'bcrypt';
//유저 생성
export const createUser = async (email, id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10); //패스워드 암호화
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [email, id, hashedPassword]);
};

//유저 확인
export const findUserById = async (id) => {
  try {
    const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_ID, [id]);

    return rows[0];
  } catch (e) {
    console.error(e);
  }
};
