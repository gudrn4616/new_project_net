const testDbConnection = async (pool, dbName) => {
  try {
    const [rows] = await pool.query('SELECT 1+1 AS result');
    console.log(`${dbName} 테스트 쿼리 결과: ${rows[0].result}`);
  } catch (err) {
    console.error('데이터베이스 연결 테스트 실패:', err);
  }
};

const testAllDbConnections = async (pools) => {
  await testDbConnection(pools.USER_DB, 'USER_DB');
};

export { testDbConnection, testAllDbConnections };
