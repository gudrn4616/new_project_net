import pools from '../database.js';
import { SQL_QUERIES } from './user.query.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const createUser = async (email, userId, password) => {
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [email, userId, password]);
};

export const findUserById = async (userId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_ID, [userId]);

  return toCamelCase(rows[0]);
};
