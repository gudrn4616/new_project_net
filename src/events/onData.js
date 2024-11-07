import { config } from '../config/config.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { getHandlerById, getProtoTypeNameByHandlerId } from '../handler/index.js';
import { PacketType } from '../constants/header.js';
import userRegisterHandler from '../handler/user/userRegister.handler.js';
import userLoginhandler from '../handler/user/userLogin.handler.js'
export const onData = (socket) => (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

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
    console.log(packetType);

    // 버전 길이 읽기 (1바이트)
    const versionLength = socket.buffer.readUInt8(config.packet.header.packetType);
    console.log(versionLength);

    // 버전 문자열 읽기
    const version = socket.buffer.toString(
      'utf8',
      config.packet.header.packetType + config.packet.header.versionLength,
      config.packet.header.packetType + config.packet.header.versionLength + versionLength,
    );
    console.log(version);
    if (version !== config.client.version) {
      throw new Error('Invalid version');
    }

    // 시퀀스 번호 읽기 (4바이트)
    const sequence = socket.buffer.readUInt32BE(
      config.packet.header.packetType + config.packet.header.versionLength + versionLength,
    );
    console.log(sequence);

    // 페이로드 길이 읽기 (4바이트)
    const payloadLength = socket.buffer.readUInt32BE(
      config.packet.header.packetType +
        config.packet.header.versionLength +
        versionLength +
        config.packet.header.sequence,
    );
    console.log(payloadLength);

    if (socket.buffer.length >= totalHeaderLength + payloadLength) {
      const packetStartIndex = totalHeaderLength + versionLength;
      const gamePacket = socket.buffer.subarray(packetStartIndex, packetStartIndex + payloadLength);
      socket.buffer = socket.buffer.subarray(packetStartIndex + payloadLength);

      console.log('Buffer:', gamePacket);

      try {
        const protoTypeName = getProtoTypeNameByHandlerId(packetType);
        const [namespace, typeName] = protoTypeName.split('.');
        // payload 추출 하기 위해 gamepacket으로 디코딩
        const decodedMessage = decodedPacket['gamePacket']['GamePacket'].decode(gamePacket);
        console.log('Decoded Packet:', decodedMessage);
        let payload;
        for (const [key, value] of Object.entries(decodedMessage)) {
          payload = value;
        }
        const expectedFields = Object.keys(decodedPacket[namespace][typeName].fields);
        const actualFields = Object.keys(payload);
        const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
        if (missingFields.length > 0) {
          throw new Error(`Missing fields: ${missingFields.join(', ')}`);
        }

        switch (packetType) {
          case PacketType.REGISTER_REQUEST:
            userRegisterHandler(socket, payload);
            break;
          case PacketType.LOGIN_REQUEST:
            userLoginhandler(socket, payload);
            break;
        }
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
