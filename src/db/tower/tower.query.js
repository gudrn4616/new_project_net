export const SQL_QUERIES = {
    // 가격 조회
    GET_TOWER_PRICE : 'SELECT price FROM towers WHERE id = ?',

    // 소유 골드
    GET_USER_GOLD : 'SELECT gold FROM users WHERE id = ?',

    // 골드 차감
    UPDATE_USER_GOLD : 'UPDATE users SET gold = gold - ? WHERE id =?'
}