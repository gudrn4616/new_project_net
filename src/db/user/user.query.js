export const USER_QUERIES = {
  CREATE_USER: 'INSERT INTO account (email, user_id, password) VALUES (?, ?, ?)',
  FIND_USER_BY_ID: 'SELECT * FROM account WHERE user_id = ?',
};
