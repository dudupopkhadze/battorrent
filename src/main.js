import { downloadTorrent } from "./download.js";
import * as tkparser from "./parser.js";

const torrent = tkparser.open(process.argv[2] ?? "aircraft.torrent");

downloadTorrent(torrent, torrent.info.name);
