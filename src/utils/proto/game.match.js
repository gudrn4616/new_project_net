import { config } from '../../config/config.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PacketType } from '../../constants/header.js';

const makePacket = (message, type) => {
  const versionLength = Buffer.from(config.server.clientVersion).length;
  const headerLength =
    config.packet.header.packetType +
    config.packet.header.versionLength +
    versionLength +
    config.packet.header.sequence +
    config.packet.header.payloadLength;
  const totalLength = headerLength + message.length;

  const buffer = Buffer.alloc(totalLength);
  let offset = 0;

  // 패킷 타입 (2바이트)
  buffer.writeUInt16LE(type, offset);
  offset += config.packet.header.packetType;

  // 버전 길이 (1바이트)
  buffer.writeUInt8(versionLength, offset);
  offset += config.packet.header.versionLength;

  // 버전 문자열
  buffer.write(config.client.version, offset);
  offset += versionLength;

  // 시퀀스 번호 (4바이트)
  buffer.writeUInt32LE(0, offset);
  offset += config.packet.header.sequence;

  // 페이로드 길이 (4바이트)
  buffer.writeUInt32LE(message.length, offset);
  offset += config.packet.header.payloadLength;

  return Buffer.concat([buffer, message]);
};

export const createMatchRequest = (socket, data) => {
  const protoMessages = getProtoMessages();
  const matchStartNotification = protoMessages.S2CMatchStartNotification;
  const payload = {
    initialGameState: data.initialGameState,
    playerData: data.playerData,
    opponentData: data.opponentData,
  };
  const message = matchStartNotification.create(payload);
  const matchStartPacket = matchStartNotification.encode(message).finish();
  return makePacket(matchStartPacket, PacketType.MATCH_START_NOTIFICATION);
};

export const createGameEndRequest = (socket, data) => {
  const protoMessages = getProtoMessages();
  const gameEndNotification = protoMessages.S2CGameEndNotification;
  const payload = {
    isWin: data.isWin,
  };
  const message = gameEndNotification.create(payload);
  const gameEndPacket = gameEndNotification.encode(message).finish();
  return makePacket(gameEndPacket, PacketType.GAME_END_REQUEST);
};
