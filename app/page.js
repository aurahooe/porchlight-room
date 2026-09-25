"use client";
import { useEffect, useState } from "react";
import Chrome from "@/components/Chrome";
import Clock from "@/components/Clock";
import { supabase } from "@/lib/supabase";
import { copyForHour } from "@/lib/hours";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [hours, setHours] = useState([]);
  const [headline, blurb] = copyForHour();

  useEffect(() => {
    (async () => {
      const [{ data: publicNotes }, { data: editions }] = await Promise.all([
        supabase.from("wellroom_notes").select("id,title,body,created_at").eq("is_public", true).order("created_at", { ascending: false }).limit(8),
        supabase.from("wellroom_hours").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      setNotes(publicNotes || []);
      setHours(editions || []);
    })();
  }, []);

  return (
    <Chrome>
      <section className="hero">
        <div>
          <div className="kicker">Living edition</div>
          <h1 className="lede">{hours[0]?.headline || headline}</h1>
          <p className="sub">{hours[0]?.blurb || blurb}</p>
        </div>
        <Clock />
      </section>
      <section className="grid">
        <article className="card span-7">
          <div className="meta">Public slips</div>
          <h2>On the stoop</h2>
          {notes.length === 0 && <p className="sub">Quiet for now. Sign in, write something, mark it public.</p>}
          {notes.map((n) => (
            <div className="piece" key={n.id}>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              <div className="meta">{new Date(n.created_at).toLocaleString()}</div>
            </div>
          ))}
        </article>
        <aside className="card span-5">
          <div className="meta">Hourly turn</div>
          <h2>What the room just learned</h2>
          {(hours.length ? hours : [{ headline, blurb }]).map((h, i) => (
            <div className="piece" key={h.id || i}>
              <strong>{h.headline}</strong>
              <p>{h.blurb}</p>
            </div>
          ))}
        </aside>
      </section>
    </Chrome>
  );
}
