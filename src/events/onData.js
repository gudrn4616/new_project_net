import { PACKET_HEADER_SIZES } from '../constants/header.js';
import { getProtoMessages, loadProtos } from '../init/loadProtos.js';
import { getHandlerByPacketType } from '../handler/index.js';
import { PacketType } from '../constants/header.js';
import userRegisterHandler from '../handler/user/userRegister.handler.js';

export const onData = (socket) => (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  //헤더 사이즈 정의
  const headerSize =
    PACKET_HEADER_SIZES.PACKET_TYPE +
    PACKET_HEADER_SIZES.VERSION_LENGTH +
    PACKET_HEADER_SIZES.SEQUENCE +
    PACKET_HEADER_SIZES.PAYLOAD_LENGTH;

  //패킷 버퍼 확인
  while (socket.buffer.length >= headerSize) {
    const packetType = socket.buffer.readUInt16BE(0);
    const versionLength = socket.buffer.readUInt8(PACKET_HEADER_SIZES.PACKET_TYPE);
    const totalHeaderLength = headerSize + versionLength; //총 헤더길이

    // 전체 패킷이 준비될때까지 반복
    if (socket.buffer.length < totalHeaderLength) {
      break;
    }

    const versionOffset = PACKET_HEADER_SIZES.PACKET_TYPE + PACKET_HEADER_SIZES.VERSION_LENGTH;
    // TODO: version 검증
    const version = socket.buffer.toString('utf-8', versionOffset, versionOffset + versionLength);

    const sequenceOffset = versionOffset + versionLength;
    const sequence = socket.buffer.readUInt32BE(sequenceOffset);

    const payloadLengthOffset = sequenceOffset + PACKET_HEADER_SIZES.SEQUENCE;
    const payloadLength = socket.buffer.readUInt32BE(payloadLengthOffset);

    // 패킷 전체 길이
    const packetLength = totalHeaderLength + payloadLength;

    // 버퍼 길이가 패킷 길이보다 짧다면 데이터를 모두 수신할떄까지 while 반복
    if (socket.buffer.length < packetLength) {
      break;
    }

    // 실제 데이터
    const payload = socket.buffer.slice(totalHeaderLength, packetLength);
    // 만약 남은 데이터가 있다면 버퍼에 다시 넣어주는 코드
    socket.buffer = socket.buffer.slice(packetLength);

    
    console.log({ packetType, version, sequence, payloadLength, payload });

    try {
      
      const decodedPacket = getProtoMessages();
      let test1 = decodedPacket.registerRequest.packetHeader.decode(payload)
      let test2= decodedPacket['registerRequest']['packetHeader'].decode(payload)
      console.log("test2:",test2)
      console.log("test1:",test1)

      
      // const handler = getHandlerByPacketType(packetType);
      // if (handler) {
      //   handler(socket, decodedPacket);
      // }

      // switch (packetType) {
      //   case PacketType.REGISTER_REQUEST:
      //     await userRegisterHandler(socket, decodedPacket.registerRequest);
      //     break;
      //   case PacketType.LOGIN_REQUEST:
      //     await userLoginhandler(socket, decodedPacket.loginRequest);
      //     break;
      // }
    } catch (err) {
      console.error('패킷 처리 에러:', err);
    }
  }
};


const decodePayload = async (payload, namespace, type) => {
  try {
    // 프로토 메시지를 로드합니다.
    
    const protoMessages = getProtoMessages();

    // 네임스페이스와 메시지 타입을 찾습니다.
    const MessageType = protoMessages[namespace]?.[type];
    if (!MessageType) {
      throw new Error(`Message type ${namespace}.${type}을 찾을 수 없습니다.`);
    }

    // payload를 디코딩합니다.
    const decodedMessage = MessageType.decode(payload);

    // 각 필드의 값 확인
    const { id, password, email } = decodedMessage;
    console.log("ID:", id);
    console.log("Password:", password);
    console.log("Email:", email);

    return { id, password, email };
  } catch (error) {
    console.error('Payload 디코딩 중 오류가 발생했습니다:', error);
  }
};