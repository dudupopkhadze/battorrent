import { getPeers } from "./tracker.js";

export const download = (torrent) => {
  getPeers(torrent, (peers) => {
    console.log("list of peers: ", peers);
  });
};
