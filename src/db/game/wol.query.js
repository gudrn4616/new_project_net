export const SQL_QUERIES = {
  // 게임 기록 생성
  CREATE_WOL:
    'INSERT INTO `TOWER_USER_DB`.`game_record` (account_id, victory_count, defeat_count) VALUES (?, ?, ?)',
  // 게임 기록 확인
  FIND_WOL_BY_ID: 'SELECT * FROM `TOWER_USER_DB`.`game_record` WHERE account_id = ?',
  // 게임 기록 업데이트
  UPDATE_WOL:
    'UPDATE `TOWER_USER_DB`.`game_record` SET victory_count = ?, defeat_count = ? WHERE account_id = ?',
};
