import net from "net";
import Buffer from "buffer";
import * as Message from "./message.js";
import { getPeers } from "./tracker.js";

export const download = (torrent) => {
  getPeers(torrent, (peers) => {
    const requested = [];
    console.log("list of peers: ", peers);
    peers.forEach((peer) => fetchPeer(peer, torrent, requested));
  });
};

const fetchPeer = (peer, torrent, requested) => {
  const socket = new net.Socket();
  socket.on("error", console.log);
  socket.connect(peer.port, peer.ip, () => {
    socket.write(Message.buildHandshake(torrent));
  });
  combineTCPMessages(socket, (message) =>
    messageHandler(message, socket, requested)
  );
};

const messageHandler = (msg, socket, requested) => {
  if (isHandshake(msg)) {
    socket.write(message.buildInterested());
  } else {
    const m = message.parse(msg);

    if (m.id === 0) chokeHandler();
    if (m.id === 1) unchokeHandler();
    if (m.id === 4) haveHandler(m.payload, socket, requested);
    if (m.id === 5) bitfieldHandler(m.payload);
    if (m.id === 7) pieceHandler(m.payload);
  }
};

const chokeHandler = () => {};

const unchokeHandler = () => {};

const haveHandler = (payload, socket, requested) => {
  const pieceIndex = payload.readUInt32BE(0);
  if (!requested[pieceIndex]) {
    socket.write(message.buildRequest());
  }
  requested[pieceIndex] = true;
};

const bitfieldHandler = (payload) => {};

const pieceHandler = (payload) => {};

const isHandshakeMessage = (msg) => {
  return (
    msg.length === msg.readUInt8(0) + 49 &&
    msg.toString("utf8", 1) === "BitTorrent protocol"
  );
};

const combineTCPMessages = (socket, callback) => {
  let resultBuff = Buffer.alloc(0);
  let handshake = true;

  socket.on("data", (recvBuf) => {
    // msgLen calculates the length of a whole message
    const msgLen = () =>
      handshake ? resultBuff.readUInt8(0) + 49 : resultBuff.readInt32BE(0) + 4;
    resultBuff = Buffer.concat([resultBuff, recvBuf]);

    while (resultBuff.length >= 4 && resultBuff.length >= msgLen()) {
      callback(resultBuff.slice(0, msgLen()));
      resultBuff = resultBuff.slice(msgLen());
      handshake = false;
    }
  });
};

const onError = (err) => {
  console.log("#### ERROR ####");
  console.log(err);
  console.log("!!!!!!!!!!!!!!!");
};
