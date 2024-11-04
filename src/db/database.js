import mysql from 'mysql2/promise';
import { config } from '../config/config.js';
import { formatDate } from '../utils/dataFormatter.js';

const { db } = config;

const createPool = async (dbconfig) => {
  const pool = mysql.createPool({
    host: dbconfig.host,
    port: dbconfig.port,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    waitForConnections: true,
    connectionLimit: 10, // 커넥션 풀에서 최대 연결 수
    queueLimit: 0, // 0일 경우 무제한 대기열
  });

  const originalQuery = pool.query;
  pool.query = (sql, params) => {
    const date = new Date();

    console.log(
      `[${formatDate(date)}] 쿼리 실행 중: ${sql} ${params ? `, ${JSON.stringify(params)}` : ''}`,
    );

    return originalQuery.call(pool, sql, params); //원래 함수 호출
  };

  return pool;
};

const pool = {
  USER_DB: createPool(db),
};

export default pool;
