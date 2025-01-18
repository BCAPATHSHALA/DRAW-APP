import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8081 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}
const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on("connection", function connection(ws, req) {
  const url = req.url; // ws://localhost:8080?token=123123
  console.log("I am connected: ", url);

  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]); // [" ws://localhost:8080", "token=123123"]
  const token = queryParams.get("token") || ""; // "123123"
  const userId = checkUser(token);
  console.log("userId 1", userId);

  if (userId == null) {
    ws.close();
    return null;
  }

  console.log("userId 2", userId);

  users.push({
    userId,
    rooms: [],
    ws,
  });

  // console.log("users", users);

  ws.on("message", async function message(data) {
    console.log("parsedData", data);
    const parsedData = JSON.parse(data as unknown as string); // {type: "join-room", roomId: 1}

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((x) => x === parsedData.room);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            })
          );
        }
      });
    }
  });

  ws.on("close", function close() {
    const user = users.find((x) => x.ws === ws);
    if (user) {
      console.log("Client disconnected");
      users.splice(users.indexOf(user), 1);
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.send("Hello from the server");
});
