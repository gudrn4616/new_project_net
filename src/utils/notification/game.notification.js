import createHeader from '../createHeader.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PayloadName } from '../../constants/packetTypes.js';

const makeNotification = (message, packetType, sequence) => {
  const header = createHeader(message.length, packetType, sequence);

  return Buffer.concat([header, message]);
};

export const createNotificationPacket = (payload, packetType, sequence) => {
  const protoMessages = getProtoMessages();
  const notification = protoMessages.gamePacket.GamePacket;

  const payloadName = PayloadName[packetType];
  const notificationPacket = notification.encode({ [payloadName]: payload }).finish();

  return makeNotification(notificationPacket, packetType, sequence);
};
