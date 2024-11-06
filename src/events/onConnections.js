import { onData } from './onData.js';
import onEnd from './onEnd.js';
import onError from './onError.js';

export const onConnections = (socket) => {
  console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);

  socket.buffer = Buffer.alloc(0);

  // 클로저로 전달하여 소켓 핸들러 설정
  socket.on('data', (data) => onData(socket)(data));
  socket.on('end', () => onEnd(socket)());
  socket.on('error', (err) => onError(socket)(err));
};
