import pools from '../database.js';
import { SQL_QUERIES } from './user.query.js';

//유저 생성
export const createUser = async (id, password, email) => {
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [email, id, password]);
};

//유저 확인
export const findUserById = async (id) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_ID, [id]);

  return rows[0];
};
