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

// Log CLIENT_VERSION to ensure it's received properly
console.log('CLIENT_VERSION in config:', CLIENT_VERSION);

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
