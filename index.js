"use strict";

import fs from "fs";
import bencode from "bencode";

const torrentFileContent = fs.readFileSync("puppy.torrent");
const torrent = bencode.decode(torrentFileContent);

const torrentString = Buffer.from(torrent.announce, "utf8").toString();

console.log(torrentString);

console.log(torrent.announce);
