import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import {leaderboardStore} from './leaderboard.mjs';
import {scoreHandler} from './leaderboard-api.mjs';
const handleScores=scoreHandler(leaderboardStore(process.env.LEADERBOARD_FILE));
const root = resolve("dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};
createServer(async (req, res) => {
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.replace(/\/$/,'')==='/api/leaderboard')return handleScores(req,res);
  try {
    let file = resolve(
      root,
      "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
    );
    if (file !== root && !file.startsWith(root + sep)) throw Error();
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end("404");
  }
}).listen(Number(process.env.PORT)||4312, "127.0.0.1", () => console.log("Local: http://127.0.0.1:"+(process.env.PORT||4312)));
