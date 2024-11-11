import { getProtoMessages } from '../../init/loadProtos.js';
import createHeader from '../createHeader.js';
import { PayloadName } from '../../constants/packetTypes.js';

const createResponse = (responsePayload, user, packetType) => {
  const protoMessages = getProtoMessages();
  const response = protoMessages.gamePacket.GamePacket;

  const payloadName = PayloadName[packetType];
  // console.log('payloadName: ', payloadName);
  const payloadBuffer = response.encode({ [payloadName]: responsePayload }).finish();

  if (typeof packetType === 'undefined') {
    throw new Error('Packet type is undefined');
  }

  const sequence = user ? user.getSequence() : 0;

  const header = createHeader(payloadBuffer.length, packetType, sequence);

  return Buffer.concat([header, payloadBuffer]);
};

export default createResponse;
