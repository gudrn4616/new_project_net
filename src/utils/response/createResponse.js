import { getProtoMessages } from "../../init/loadProtos.js";
import createHeader from "../createHeader.js";

const createResponse = (responsePayload, packetType) => {
  const decodedPacket = getProtoMessages()
  const payloadBuffer = decodedPacket['gamePacket']['GamePacket'].encode(responsePayload).finish();

  const header = createHeader(
    payloadBuffer.length,
    packetType,
    0, // user.sequence로 바꿔야 함
  );
  console.log("header:",header)
  return Buffer.concat([header, payloadBuffer]);
};

export default createResponse
