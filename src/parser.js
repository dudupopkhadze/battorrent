import bencode from "bencode";
import fs from "fs";

export const open = (path) => {
  return bencode.decode(fs.readFileSync(path));
};

export const size = (torrent) => {
  return 0;
};

export const infoHash = (torrent) => {};
