import net from 'net';

// 서버 주소와 포트
const HOST = '127.0.0.1';
const PORT = 3000;

// 클라이언트 생성
const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('Connected to server');

  // 샘플 패킷 데이터 작성
  const packetType = Buffer.alloc(2); // 패킷 타입 (2바이트)
  packetType.writeUInt16BE(1, 0); // 예제 타입값 세팅

  const version = Buffer.alloc(1); // 버전 (1바이트)
  version.writeUInt8(1, 0); // 예제 버전값 세팅

  const sequence = Buffer.alloc(4); // 시퀀스 (4바이트)
  sequence.writeUInt32BE(123456, 0); // 예제 시퀀스값 세팅

  const payload = Buffer.from('Hello, this is payload!'); // 페이로드 데이터
  const payloadLength = Buffer.alloc(4); // 페이로드 길이 (4바이트)
  payloadLength.writeUInt32BE(payload.length, 0);

  // 전체 패킷 데이터 생성
  const packet = Buffer.concat([packetType, version, sequence, payloadLength, payload]);

  // 패킷 전송
  client.write(packet);
});

client.on('data', (data) => {
  console.log('Received:', data);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Error:', err);
});
