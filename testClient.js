import net from 'net';

const HOST = '127.0.0.1';
const PORT = 3000;

const client = new net.Socket();

const HANDLER_IDS = {
  SPAWN_MONSTER_REQUEST: 11,
  SPAWN_MONSTER_RESPONSE: 12,
  SPAWN_ENEMY_MONSTER_NOTIFICATION: 13,
  MONSTER_ATTACK_BASE_REQUEST: 16,
  UPDATE_BASE_HP_NOTIFICATION: 17,
};

client.connect(PORT, HOST, () => {
  console.log('Connected to server');

  // 샘플 패킷 데이터 작성
  const packetType = Buffer.alloc(2); // 패킷 타입 (2바이트)
  packetType.writeUInt16BE(HANDLER_IDS.SPAWN_MONSTER_REQUEST, 0); // 예제 타입값 세팅

  const version = Buffer.from('1.0.0'); // 버전 (5바이트, "1.0.0")
  const versionLength = Buffer.alloc(1); // 버전 길이 (1바이트)
  versionLength.writeUInt8(version.length, 0);

  const sequence = Buffer.alloc(4); // 시퀀스 (4바이트)
  sequence.writeUInt32BE(123456, 0); // 예제 시퀀스값 세팅

  const payload = Buffer.from('Hello, this is payload!'); // 페이로드 데이터
  const payloadLength = Buffer.alloc(4); // 페이로드 길이 (4바이트)
  payloadLength.writeUInt32BE(payload.length, 0);

  // 전체 패킷 데이터 생성
  const packet = Buffer.concat([
    packetType,
    versionLength,
    version,
    sequence,
    payloadLength,
    payload,
  ]);

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
