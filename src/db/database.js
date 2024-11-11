import mysql from 'mysql2/promise';
import { config } from '../config/config.js';
import { formatDate } from '../utils/dataFormatter.js';

const { db } = config;

// 데이터베이스 커넥션 풀 생성 함수
const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    waitForConnections: true,
    connectionLimit: 10, // 커넥션 풀에서 최대 연결 수
    queueLimit: 0, // 0일 경우 무제한 대기열
  });

  const originalQuery = pool.query;
  pool.query = (sql, params) => {
    const date = new Date();

    console.log(
      `[${formatDate(date)}] 쿼리 실행 중: ${sql} ${params ? `, ${JSON.stringify(params)}` :''}`,
    );

    return originalQuery.call(pool, sql, params); //원래 함수 호출
  };

  return pool;
};

// 여러 데이터베이스 커넥션 풀 생성
const pools = {
  USER_DB: createPool(db),
};

export default pools;
