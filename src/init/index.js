import { loadProtos } from './loadProtos.js';

const initServer = async () => {
  try {
    await loadProtos();
    //DB 테스트
  } catch (error) {
    console.error('서버 초기화 중 오류가 발생했습니다:', error);
  }
};

export default initServer;
