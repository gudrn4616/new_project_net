import net from 'net';
import onConnections from './events/onConnections.js';
import initServer from './init/index.js';
const server = net.createServer(onConnections);

initServer()
  .then(() => {
    server.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('서버 초기화 중 오류가 발생했습니다:', error);
  });
