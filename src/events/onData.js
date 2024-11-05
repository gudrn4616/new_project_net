import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
export const onData = (socket) => (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 패킷의 전체 헤더 길이 계산
  const totalHeaderLength =
    config.packet.header.packetType +
    config.packet.header.versionLength +
    config.packet.header.sequence +
    config.packet.header.payloadLength;

  while (socket.buffer.length >= totalHeaderLength) {
    // 패킷 타입 읽기 (2바이트)
    const packetType = socket.buffer.readUInt16BE(0, config.packet.header.packetType);

    // 버전 길이 읽기 (1바이트)
    const versionLength = socket.buffer.readUInt8(
      config.packet.header.packetType,
      config.packet.header.versionLength,
    );

    // 버전 문자열 읽기
    const version = socket.buffer.toString(
      'utf8',
      config.packet.header.packetType + config.packet.header.versionLength,
      config.packet.header.packetType + config.packet.header.versionLength + versionLength,
    );

    if (version !== config.client.version) {
      throw new Error('Invalid version');
    }

    // 시퀀스 번호 읽기 (4바이트)
    const sequence = socket.buffer.readUInt32BE(
      config.packet.header.packetType +
        config.packet.header.versionLength +
        versionLength +
        config.packet.header.sequence,
    );

    // 페이로드 길이 읽기 (4바이트)
    const payloadLength = socket.buffer.readUInt32BE(
      config.packet.header.packetType +
        config.packet.header.versionLength +
        versionLength +
        config.packet.header.sequence,
    );

    if (socket.buffer.length >= totalHeaderLength) {
      const packet = socket.buffer.subarray(
        totalHeaderLength + versionLength,
        totalHeaderLength + versionLength + payloadLength,
      );
      socket.buffer = socket.buffer.subarray(totalHeaderLength + versionLength + payloadLength);
      try {
        switch (packetType) {
          case PacketType.MATCH_REQUEST:
            break;
        }
      } catch (error) {
        console.error(error);
      }

      break;
    }

    // 페이로드 읽기
    const payload = socket.buffer.slice(11 + versionLength, 11 + versionLength + payloadLength);

    // 나머지 버퍼 업데이트
    socket.buffer = socket.buffer.slice(totalLength);
  }
};
