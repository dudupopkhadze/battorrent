import net from "net";
import Buffer from "buffer";
import { getPeers } from "./tracker.js";

export const download = (torrent) => {
  getPeers(torrent, (peers) => {
    console.log("list of peers: ", peers);
  });
};

const fetchPeer = (peer) => {
  const socket = new net.Socket();
  socket.on("error", console.log);
  socket.connect(peer.port, peer.ip, () => {
    socket.write("hello");
  });
  socket.on("data", (data) => {
    console.log(data.toString());
    socket.end();
  });
};

const onError = (err) => {
  console.log("#### ERROR ####");
  console.log(err);
  console.log("!!!!!!!!!!!!!!!");
};
