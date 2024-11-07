export const SQL_QUERIES = {
  // 유저 생성
  CREATE_USER: 'INSERT INTO `TOWER_USER_DB`.`account` (email, user_id, password) VALUES (?, ?, ?)',
  // 유저 확인
  FIND_USER_BY_ID: 'SELECT * FROM `TOWER_USER_DB`.`account` WHERE user_id = ?',
};
