import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, req) {
  const url = req.url; // ws://localhost:8080?token=123123

  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]); // [" ws://localhost:8080", "token=123123"]
  const token = queryParams.get("token") || ""; // "123123"
  const decode = jwt.verify(token, JWT_SECRET); // {userId: 1}

  if (!decode || !(decode as JwtPayload).userId) {
    ws.close();
    return;
  }

  ws.on("message", function incoming(message) {
    ws.send("PONG MESSAGE: " + message);
  });
});
