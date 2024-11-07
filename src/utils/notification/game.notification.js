import createHeader from '../createHeader.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PacketType } from '../../constants/packetTypes.js';

const makeNotification = (message, packetType, sequence) => {
  const header = createHeader(message.length, packetType, sequence);

  return Buffer.concat([header, message]);
};

export const createSpawnMonsterPacket = (payload) => {
  const protoMessages = getProtoMessages();
  const response = protoMessages.gamepacket.GamePacket;

  const responsePacket = response.encode({ spawnMonsterResponse: payload }).finish();

  return makeNotification(responsePacket, PacketType.SPAWN_MONSTER_RESPONSE, 0);
};

export const createSpawnEnemyMonsterPacket = (payload) => {
  const protoMessages = getProtoMessages();
  const response = protoMessages.gamepacket.GamePacket;

  const responsePacket = response.encode({ spawnEnemyMonsterNotification: payload }).finish();

  return makeNotification(responsePacket, PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION, 0);
};
