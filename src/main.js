import { getPeers } from "./tracker.js";
import * as tkparser from "./parser.js";

const torrent = tkparser.open("test.torrent");
getPeers(torrent, (peers) => {
  console.log("list of peers: ", peers);
});
