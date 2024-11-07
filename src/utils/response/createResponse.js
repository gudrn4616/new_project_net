import { getProtoMessages } from '../../init/loadProtos.js';
import createHeader from '../createHeader.js';

const createResponse = (responsePayload, packetType) => {
  // Check if getProtoMessages returns expected structure
  const decodedPacket = getProtoMessages();
  if (
    !decodedPacket ||
    !decodedPacket['gamePacket'] ||
    !decodedPacket['gamePacket']['GamePacket']
  ) {
    throw new Error('Decoded packet structure is invalid');
  }

  // Ensure responsePayload is defined
  if (!responsePayload) {
    throw new Error('Response payload is undefined');
  }

  const payloadBuffer = decodedPacket['gamePacket']['GamePacket'].encode(responsePayload).finish();
  // Ensure packetType is defined
  if (typeof packetType === 'undefined') {
    throw new Error('Packet type is undefined');
  }

  const header = createHeader(
    payloadBuffer.length,
    packetType,
    0, // user.sequence로 바꿔야 함
  );

  console.log('header:', header);
  return Buffer.concat([header, payloadBuffer]);
};

export default createResponse;
