import { config } from '../config/config.js';

export default function onData(socket) {
  socket.on('data', (data) => {
    socket.buffer = Buffer.concat([socket.buffer, data]);

    // 고정 헤더 길이 (version - string 까지 더해야 총 헤더 길이)
    const fixedHeaderLength =
      config.packet.header.packetType +
      config.packet.header.versionLength +
      config.packet.header.sequence +
      config.packet.header.payloadLength;

    while (socket.buffer.length > fixedHeaderLength) {
      let offset = 0;

      // packetType (2 bytes)
      const packetType = socket.buffer.readUInt16BE(offset);
      offset += config.packet.header.packetType;

      // versionLength (1 byte)
      const versionLength = socket.buffer.readUInt8(offset);
      offset += config.packet.header.versionLength;

      // version (variable length)
      const version = socket.buffer.toString('utf8', offset, offset + versionLength);
      offset += versionLength;

      // sequence (4 bytes)
      const sequence = socket.buffer.readUInt32BE(offset);
      offset += config.packet.header.sequence;

      // payloadLength (4 bytes)
      const payloadLength = socket.buffer.readUInt32BE(offset);
      offset += config.packet.header.payloadLength;

      // 전체 패킷 길이 계산 (헤더 길이 + 버전 문자열 길이 + 페이로드 길이)
      const totalPacketLength = fixedHeaderLength + versionLength + payloadLength;

      // 전체 패킷이 도착하지 않은 경우 break
      if (socket.buffer.length < totalPacketLength) break;

      // payload
      const header = socket.buffer.subarray(offset);
      const payload = socket.buffer.subarray(offset, offset + payloadLength);

      // 패킷 처리 (로그 출력)
      console.log(`Packet Type: ${packetType}`);
      console.log(`Version: ${version}`);
      console.log(`Sequence: ${sequence}`);
      console.log(`Payload: ${payload.toString()}`);
    }
  });
}
