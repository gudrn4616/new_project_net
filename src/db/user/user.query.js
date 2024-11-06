export const SQL_QUERIES = {
  // 유저 생성
  CREATE_USER: 'INSERT INTO account (email, user_id, password) VALUES (?, ?, ?)',
  // 유저 확인
  FIND_USER_BY_ID: 'SELECT * FROM account WHERE user_id = ?',
};
