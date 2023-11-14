import { download } from "./download.js";
import * as tkparser from "./parser.js";

const torrent = tkparser.open(process.argv[2] ?? "test.torrent");

download(torrent);
