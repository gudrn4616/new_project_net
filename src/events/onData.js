import { packetParser } from '../utils/parser/packetParser.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { PACKET_HEADER_SIZES, PacketType } from '../constants/header.js';
import { getHandlerById, getProtoTypeNameByHandlerId } from '../handler/index.js';
import protobuf from 'protobufjs';

// 각 헤더 크기 상수
const {
  PACKET_TYPE: PACKET_TYPE_LENGTH,
  VERSION_LENGTH,
  SEQUENCE,
  PAYLOAD_LENGTH,
} = PACKET_HEADER_SIZES;
const TOTAL_HEADER_LENGTH = PACKET_TYPE_LENGTH + VERSION_LENGTH + SEQUENCE + PAYLOAD_LENGTH;

export const onData = (socket) => (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  while (socket.buffer.length > TOTAL_HEADER_LENGTH) {
    const packetType = socket.buffer.readUInt16BE(0);
    const version = socket.buffer.readUInt8(PACKET_TYPE_LENGTH);
    const sequence = socket.buffer.readUInt32BE(PACKET_TYPE_LENGTH + VERSION_LENGTH);
    const payloadLength = socket.buffer.readUInt32BE(
      PACKET_TYPE_LENGTH + VERSION_LENGTH + SEQUENCE,
    );

    if (socket.buffer.length >= TOTAL_HEADER_LENGTH + payloadLength) {
      const packet = socket.buffer.subarray(
        TOTAL_HEADER_LENGTH,
        TOTAL_HEADER_LENGTH + payloadLength,
      );
      socket.buffer = socket.buffer.subarray(TOTAL_HEADER_LENGTH + payloadLength);

      try {
        handlePacket(packetType, packet, socket);
      } catch (error) {
        console.error(`Packet handling error: ${error.message}`);
        throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, error.message);
      }
    } else {
      break;
    }
  }
};

const handlePacket = (packetType, packet, socket) => {
  try {
    switch (packetType) {
      case PacketType.SPAWN_MONSTER_REQUEST:
      case PacketType.SPAWN_MONSTER_RESPONSE:
      case PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION:
      case PacketType.MONSTER_ATTACK_BASE_REQUEST:
      case PacketType.UPDATE_BASE_HP_NOTIFICATION:
        processGamePacket(packet, socket);
        break;
      default:
        throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, 'packet type is not supported.');
    }
  } catch (error) {
    console.error(`Packet processing error: ${error.message}`);
    throw error;
  }
};

const processGamePacket = (packet, socket) => {
  const { handlerId, userId, payload } = packetParser(packet);
  const handler = getHandlerById(handlerId);
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);

  if (!handler || !protoTypeName) {
    const errorMsg = `Handler or proto type not found for handlerId ${handlerId}`;
    console.error(errorMsg);
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, errorMsg);
  }

  const decodedPayload = protobuf.lookupType(protoTypeName).decode(payload);
  handler({ socket, userId, payload: decodedPayload });
};
