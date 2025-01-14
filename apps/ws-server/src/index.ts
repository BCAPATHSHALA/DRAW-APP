import { WebSocketServer } from "ws";

const ws = new WebSocketServer({ port: 8080 });

ws.on("connection", function connection(ws) {
//   console.log("Client connected");
  ws.on("message", function incoming(message) {
    // console.log("Received Message => ", message);
    ws.send("PONG MESSAGE: " + message);
  });
});
