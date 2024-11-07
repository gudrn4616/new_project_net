import { getProtoMessages } from '../../init/loadProtos.js';
import createHeader from '../createHeader.js';

const createResponse = (responsePayload, user, packetType) => {
  const decodedPacket = getProtoMessages();
  if (
    !decodedPacket ||
    !decodedPacket['gamePacket'] ||
    !decodedPacket['gamePacket']['GamePacket']
  ) {
    throw new Error('Decoded packet structure is invalid');
  }

  if (!responsePayload) {
    throw new Error('Response payload is undefined');
  }

  const payloadBuffer = decodedPacket['gamePacket']['GamePacket'].encode(responsePayload).finish();
  // Ensure packetType is defined
  if (typeof packetType === 'undefined') {
    throw new Error('Packet type is undefined');
  }

  const header = createHeader(payloadBuffer.length, packetType, user?.getNextSequence() || 0);
  console.log('sequence: ', user.getNextSequence());

  console.log('header:', header);
  return Buffer.concat([header, payloadBuffer]);
};

export default createResponse;
