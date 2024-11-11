import pools from '../database.js';
import { SQL_QUERIES } from './wol.query.js';
//게임 기록 생성
export const createWOL = async (account_id, victory_count, defeat_count) => {
  await pools.USER_DB.query(SQL_QUERIES.CREATE_WOL, [account_id, victory_count, defeat_count]);
};
//게임 기록 확인
export const findWOLById = async (account_id) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_WOL_BY_ID, [account_id]);
  return rows[0];
};
//게임 기록 업데이트
export const updateWOL = async (account_id, victory_count, defeat_count) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_WOL, [victory_count, defeat_count, account_id]);
};
