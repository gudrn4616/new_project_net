import { CLIENT_VERSION } from '../../constants/env.js';
import { getProtoTypeNameByHandlerId } from '../../handler/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_HEADER_SIZES } from '../../constants/header.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  const packetTypeLength = PACKET_HEADER_SIZES.PACKET_TYPE;
  const versionLength = PACKET_HEADER_SIZES.VERSION_LENGTH;
  const sequenceLength = PACKET_HEADER_SIZES.SEQUENCE;
  const payloadLength = PACKET_HEADER_SIZES.PAYLOAD_LENGTH;

  const totalHeaderLength = packetTypeLength + versionLength + sequenceLength + payloadLength;

  /**
   * data Buffer 구조:
   *  - packetType: 2 bytes (ushort)
   *  - version: 1 byte (ubyte)
   *  - sequence: 4 bytes (uint32)
   *  - payloadLength: 4 bytes (uint32)
   *  - payload: payloadLength bytes
   */

  const packetType = data.readUInt16BE(0);
  const version = data.readUInt8(packetTypeLength);
  const sequence = data.readUInt32BE(packetTypeLength + versionLength);
  const length = data.readUInt32BE(packetTypeLength + versionLength + sequenceLength);
  const payload = data.subarray(totalHeaderLength, totalHeaderLength + length);

  if (version !== CLIENT_VERSION) {
    throw new Error('Invalid client version');
  }

  let packet;
  const commonPacket = protoMessages.common.Packet;
  try {
    packet = commonPacket.decode(payload);
  } catch (error) {
    console.error('Packet decode error:', error);
    throw new Error('Failed to decode packet payload');
  }

  const handlerId = packet.handlerId;
  const userId = packet.userId;

  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    throw new Error(`Handler ID ${handlerId} not found`);
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const payloadType = protoMessages[namespace][typeName];
  let decodedPayload;

  try {
    decodedPayload = payloadType.decode(packet.payload);
  } catch (error) {
    console.error('Payload decode error:', error);
    throw new Error('Failed to decode payload');
  }

  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(decodedPayload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

  if (missingFields.length > 0) {
    throw new Error(`Missing fields: ${missingFields.join(', ')}`);
  }

  return {
    handlerId,
    userId,
    payload: decodedPayload,
  };
};
