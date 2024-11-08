import { getProtoMessages } from '../../init/loadProtos.js';
import createHeader from '../createHeader.js';
import { PayloadName } from '../../constants/packetTypes.js';

const createResponse = (responsePayload, user, packetType) => {
  const protoMessages = getProtoMessages();
  const response = protoMessages.gamePacket.GamePacket;

  const payloadName = PayloadName[packetType];
  console.log('payloadName: ', payloadName);
  const payloadBuffer = response.encode({ [payloadName]: responsePayload }).finish();

  if (typeof packetType === 'undefined') {
    throw new Error('Packet type is undefined');
  }

  const header = createHeader(payloadBuffer.length, packetType, user.getSequence());
  console.log('sequence: ', user.getSequence());

  return Buffer.concat([header, payloadBuffer]);
};

export default createResponse;
