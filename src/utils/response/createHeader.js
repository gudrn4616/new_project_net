import { config } from '../../config/config.js';

const createHeader = (payloadLength, packetType, sequence) => {
  const {
    packetType: PACKET_TYPE_SIZE,
    versionLength: VERSION_LENGTH_SIZE,
    sequence: SEQUENCE_SIZE,
    payloadLength: PAYLOAD_LENGTH_SIZE,
  } = config.packet.header;
  const { version } = config.client.version;

  // packetType (2 bytes)
  const packetTypeBuffer = Buffer.alloc(PACKET_TYPE_SIZE);
  packetTypeBuffer.writeUint16BE(packetType, 0);

  // versionLength (1 byte)
  const versionLengthBuffer = Buffer.alloc(VERSION_LENGTH_SIZE);
  const versionBuffer = Buffer.from(version);
  versionLengthBuffer.writeUInt8(versionBuffer.length, 0);

  // sequence (4 bytes)
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
