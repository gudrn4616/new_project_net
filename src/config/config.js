import {
  PORT,
  HOST,
  CLIENT_VERSION,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} from '../constants/env.js';
import { PACKET_HEADER_SIZES } from '../constants/header.js';

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
  },
};
