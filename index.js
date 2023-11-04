"use strict";

import fs from "fs";
import dgram from "dgram";
import bencode from "bencode";

const torrentFileContent = fs.readFileSync("puppy.torrent");
const torrent = bencode.decode(torrentFileContent);

const torrentString = Buffer.from(torrent.announce, "utf8").toString();

console.log(torrentString);

console.log(torrent.announce);

const url = new URL(torrentString);

const socket = dgram.createSocket("udp4");

const message = Buffer.from("hello?", "utf8");

console.log({ message });

socket.send(message, 0, message.length, url.port, url.hostname);

socket.on("message", (msg) => {
  console.log("message received: ", msg.toString());
});
