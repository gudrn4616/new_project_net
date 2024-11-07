import pools from '../database.js';
import { SQL_QUERIES } from './user.query.js';

//유저 생성
export const createUser = async (email, id, password) => {
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [email, id, password]);
};

//유저 확인
export const findUserById = async (id) => {
  try {
    const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_ID, [id]);
    console.log("rows:",rows[0])
    return rows[0];
  } catch (e) {
    console.error(e);
  }
};
