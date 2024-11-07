import { getProtoMessages } from '../../init/loadProtos.js';
import createHeader from '../createHeader.js';

const createResponse = (responsePayload, user, packetType) => {
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

  const sequence = user ? user.getNextSequence() : 0;

  const header = createHeader(payloadBuffer.length, packetType, sequence);
  if (!user) console.log('sequence: ', sequence);

  console.log('header:', header);
  return Buffer.concat([header, payloadBuffer]);
};

export default createResponse;
