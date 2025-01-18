"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div>
        <input
          style={{
            padding: 10,
          }}
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
          }}
          type="text"
          placeholder="Room Name"
        ></input>

        <button
          style={{ padding: 10 }}
          onClick={() => {
            router.push(`/room/${roomName}`);
          }}
        >
          Join room
        </button>
      </div>
    </div>
  );
}
