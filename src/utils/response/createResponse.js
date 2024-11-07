import { config } from '../config/config.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import createHeader from './createHeader.js';

// 시퀀스 테스트
let test = 0;

const createResponse = (packetType, data = null) => {
  const header = createHeader(data.length, packetType, test++);

  const protoMessages = getProtoMessages();
};

export default createResponse;
