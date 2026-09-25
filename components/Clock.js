"use client";
import { useEffect, useState } from "react";
import { nextHour } from "@/lib/hours";

export default function Clock() {
  const [now, setNow] = useState("");
  const [left, setLeft] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      const ms = nextHour(d) - Date.now();
      const m = Math.max(0, Math.floor(ms / 60000));
      const s = Math.max(0, Math.floor((ms % 60000) / 1000));
      setLeft(`${m}m ${String(s).padStart(2, "0")}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="clock">
      <div className="meta">This hour</div>
      <b>{now || "--:--"}</b>
      <div>Next edition in {left}</div>
    </div>
  );
}
