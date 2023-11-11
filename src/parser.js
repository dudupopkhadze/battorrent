import bencode from "bencode";
import crypto from "crypto";
import bignum from "bignum";
import fs from "fs";

export const open = (path) => {
  // console.log(bencode.decode(fs.readFileSync(path), "utf8"));
  return bencode.decode(fs.readFileSync(path));
};

export const size = (torrent) => {
  const size = torrent.info.files
    ? torrent.info.files.map((file) => file.length).reduce((a, b) => a + b)
    : torrent.info.length;

  return bignum.toBuffer(size, { size: 8 });
};

export const infoHash = (torrent) => {
  const info = bencode.encode(torrent.info);
  return crypto.createHash("sha1").update(info).digest();
};
