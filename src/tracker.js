import dgram from "dgram";
import crypto from "crypto";
import * as parser from "./parser";
import { genId } from "./utils";

export const getPeers = (torrent, callback) => {
  const socket = dgram.createSocket("udp4");
  const url = torrent.announce.toString("utf8");

  sendUdpMessage(socket, buildConnReq(), url);

  socket.on("message", (resp) => messageHandler(resp, socket, url, callback));
};

const messageHandler = (resp, socket, url, cb) => {
  if (respType(resp) === "connect") {
    const connectionResponse = parseConnResp(resp);
    const announceRequest = buildAnnounceReq(connectionResponse.connectionId);
    sendUdpMessage(socket, announceRequest, url);
  } else if (respType(resp) === "announce") {
    const announceResponse = parseAnnounceResp(resp);
    cb(announceResponse.peers);
  }
};

const sendUdpMessage = (socket, message, rawUrl, cb) => {
  const url = new URL(rawUrl);
  socket.send(message, 0, message.length, url.port, url.hostname, cb);
};

const respType = (resp) => {
  // ...
};

const buildConnReq = () => {
  const buffer = Buffer.alloc(16);

  buffer.writeUInt32BE(0x417, 0); // connection id
  buffer.writeUInt32BE(0x27101980, 4);

  buffer.writeUInt32BE(0, 8); // action

  crypto.randomBytes(4).copy(buffer, 12); // transaction id

  return buffer;
};

const parseConnResp = (resp) => ({
  action: resp.readUInt32BE(0),
  transactionId: resp.readUInt32BE(4),
  connectionId: resp.slice(8),
});

const buildAnnounceReq = (connId, torrent, port = 6881) => {
  const buffer = Buffer.allocUnsafe(98);

  // connection id
  connId.copy(buf, 0);
  // action
  buffer.writeUInt32BE(1, 8);
  // transaction id
  crypto.randomBytes(4).copy(buf, 12);
  // info hash
  torrentParser.infoHash(torrent).copy(buf, 16);
  // peerId
  util.genId().copy(buf, 36);
  // downloaded
  Buffer.alloc(8).copy(buf, 56);
  // left
  torrentParser.size(torrent).copy(buf, 64);
  // uploaded
  Buffer.alloc(8).copy(buf, 72);
  // event
  buffer.writeUInt32BE(0, 80);
  // ip address
  buffer.writeUInt32BE(0, 80);
  // key
  crypto.randomBytes(4).copy(buf, 88);
  // num want
  buffer.writeInt32BE(-1, 92);
  // port
  buffer.writeUInt16BE(port, 96);

  return buffer;
};

const group = (iterable, groupSize) => {
  let groups = [];
  for (let i = 0; i < iterable.length; i += groupSize) {
    groups.push(iterable.slice(i, i + groupSize));
  }
  return groups;
};

const parseAnnounceResp = (resp) => {
  return {
    action: resp.readUInt32BE(0),
    transactionId: resp.readUInt32BE(4),
    leechers: resp.readUInt32BE(8),
    seeders: resp.readUInt32BE(12),
    peers: group(resp.slice(20), 6).map((address) => ({
      ip: address.slice(0, 4).join("."),
      port: address.readUInt16BE(4),
    })),
  };
};