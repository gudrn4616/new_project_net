import {
  CLIENT_VERSION,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  HOST,
  PORT,
} from '../constants/env.js';
import { PACKET_HEADER_SIZES } from '../constants/header.js';
import { PacketType } from '../constants/packetTypes.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
    clientVersion: CLIENT_VERSION,
  },
  db: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    header: {
      packetType: PACKET_HEADER_SIZES.PACKET_TYPE,
      versionLength: PACKET_HEADER_SIZES.VERSION_LENGTH,
      sequence: PACKET_HEADER_SIZES.SEQUENCE,
      payloadLength: PACKET_HEADER_SIZES.PAYLOAD_LENGTH,
    },
    type: {
      REGISTER_REQUEST: PacketType.REGISTER_REQUEST,
      REGISTER_RESPONSE: PacketType.REGISTER_RESPONSE,
      LOGIN_REQUEST: PacketType.LOGIN_REQUEST,
      LOGIN_RESPONSE: PacketType.LOGIN_RESPONSE,
      MATCH_REQUEST: PacketType.MATCH_REQUEST,
      MATCH_START_NOTIFICATION: PacketType.MATCH_START_NOTIFICATION,
      STATE_SYNC_NOTIFICATION: PacketType.STATE_SYNC_NOTIFICATION,
      TOWER_PURCHASE_REQUEST: PacketType.TOWER_PURCHASE_REQUEST,
      TOWER_PURCHASE_RESPONSE: PacketType.TOWER_PURCHASE_RESPONSE,
      ADD_ENEMY_TOWER_NOTIFICATION: PacketType.ADD_ENEMY_TOWER_NOTIFICATION,
      SPAWN_MONSTER_REQUEST: PacketType.SPAWN_MONSTER_REQUEST,
      SPAWN_MONSTER_RESPONSE: PacketType.SPAWN_MONSTER_RESPONSE,
      SPAWN_ENEMY_MONSTER_NOTIFICATION: PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION,
      TOWER_ATTACK_REQUEST: PacketType.TOWER_ATTACK_REQUEST,
      ENEMY_TOWER_ATTACK_NOTIFICATION: PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION,
      MONSTER_ATTACK_BASE_REQUEST: PacketType.MONSTER_ATTACK_BASE_REQUEST,
      UPDATE_BASE_HP_NOTIFICATION: PacketType.UPDATE_BASE_HP_NOTIFICATION,
      GAME_OVER_NOTIFICATION: PacketType.GAME_OVER_NOTIFICATION,
      GAME_END_REQUEST: PacketType.GAME_END_REQUEST,
      MONSTER_DEATH_NOTIFICATION: PacketType.MONSTER_DEATH_NOTIFICATION,
      ENEMY_MONSTER_DEATH_NOTIFICATION: PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION,
    },
  },
};
