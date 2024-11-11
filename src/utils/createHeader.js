import { config } from '../config/config.js';

const createHeader = (payloadLength, packetType, sequence) => {
  const {
    packetType: PACKET_TYPE_SIZE,
    versionLength: VERSION_LENGTH_SIZE,
    sequence: SEQUENCE_SIZE,
    payloadLength: PAYLOAD_LENGTH_SIZE,
  } = config.packet.header;

  if (!config.client.version) {
    throw new Error('CLIENT_VERSION is undefined');
  }

  const packetTypeBuffer = Buffer.alloc(PACKET_TYPE_SIZE);
  packetTypeBuffer.writeUInt16BE(packetType, 0);

  const versionBuffer = Buffer.from(config.client.version);

  const versionLengthBuffer = Buffer.alloc(VERSION_LENGTH_SIZE);
  versionLengthBuffer.writeUInt8(versionBuffer.length, 0);

  const sequenceBuffer = Buffer.alloc(SEQUENCE_SIZE);
  sequenceBuffer.writeUInt32BE(sequence, 0);

  const payloadLengthBuffer = Buffer.alloc(PAYLOAD_LENGTH_SIZE);
  payloadLengthBuffer.writeUInt32BE(payloadLength, 0);

  return Buffer.concat([
    packetTypeBuffer,
    versionLengthBuffer,
    versionBuffer,
    sequenceBuffer,
    payloadLengthBuffer,
  ]);
};

export default createHeader;
