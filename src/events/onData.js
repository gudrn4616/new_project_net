import { config } from '../config/config.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { getHandlerByPacketType, getProtoTypeNameByPacketType } from '../handler/index.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);
  let offset = 0;
  // 패킷의 전체 헤더 길이 계산
  const totalHeaderLength =
    config.packet.header.packetType +
    config.packet.header.versionLength +
    config.packet.header.sequence +
    config.packet.header.payloadLength;

  while (socket.buffer.length >= totalHeaderLength) {
    const decodedPacket = getProtoMessages();

    // 패킷 타입 읽기 (2바이트)
    const packetType = socket.buffer.readUInt16BE(0);
    offset += config.packet.header.packetType;

    // 버전 길이 읽기 (1바이트)
    const versionLength = socket.buffer.readUInt8(offset);
    offset += config.packet.header.versionLength;

    // 버전 문자열 읽기
    const version = socket.buffer.toString('utf8', offset, offset + versionLength);
    offset += versionLength;

    if (version !== config.client.version) {
      throw new Error('Invalid version');
    }

    // 시퀀스 번호 읽기 (4바이트)
    const sequence = socket.buffer.readUInt32BE(offset);
    offset += config.packet.header.sequence;

    // 페이로드 길이 읽기 (4바이트)
    const payloadLength = socket.buffer.readUInt32BE(offset);
    offset += config.packet.header.payloadLength;

    if (socket.buffer.length >= offset + payloadLength) {
      const gamePacket = socket.buffer.subarray(offset, offset + payloadLength);
      socket.buffer = socket.buffer.subarray(offset + payloadLength);

      try {
        const protoTypeName = getProtoTypeNameByPacketType(packetType);
        console.log(`1. protoTypeName: ${protoTypeName}`);

        const [namespace, typeName] = protoTypeName.split('.');
        const decodedMessage = decodedPacket['gamePacket']['GamePacket'].decode(gamePacket);
        console.log(`2. decodedMessage:`, decodedMessage);

        let payload;
        for (const [key, value] of Object.entries(decodedMessage)) {
          payload = value;
        }
        console.log(`3. payload:`, payload);

        const expectedFields = Object.keys(decodedPacket[namespace][typeName].fields);
        const actualFields = Object.keys(payload);
        console.log(`expectedFields:`, expectedFields);
        console.log(`actualFields:`, actualFields);

        const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
        if (missingFields.length > 0) {
          throw new Error(`Missing fields: ${missingFields.join(', ')}`);
        }

        const handler = getHandlerByPacketType(packetType);
        await handler(socket, payload);
      } catch (error) {
        if (error instanceof RangeError) {
          console.error('RangeError: index out of range', error);
        } else {
          console.error('Decoding Error:', error);
        }
      }
    } else {
      break;
    }
  }
};
