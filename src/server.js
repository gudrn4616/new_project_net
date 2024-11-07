import net from 'net';
import { config } from './config/config.js';
import { onConnections } from './events/onConnections.js';
import initServer from './init/index.js';

const server = net.createServer(onConnections);

initServer()
  .then(() => {
    server.listen(config.server.port, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다`);
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
