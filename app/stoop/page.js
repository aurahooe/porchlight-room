"use client";
import { useEffect, useState } from "react";
import Chrome from "@/components/Chrome";
import { supabase } from "@/lib/supabase";

export default function Stoop() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    supabase.from("wellroom_notes").select("id,title,body,created_at").eq("is_public", true).order("created_at", { ascending: false }).limit(40).then(({ data }) => setNotes(data || []));
  }, []);
  return (
    <Chrome>
      <section className="hero">
        <div>
          <div className="kicker">Public</div>
          <h2 className="lede">Whatever people left out.</h2>
          <p className="sub">Only notes marked public live here. Private work never leaves the drawer.</p>
        </div>
      </section>
      <section className="grid">
        <article className="card span-12">
          {notes.length === 0 && <p className="sub">Empty stoop. Be the first light.</p>}
          {notes.map((n) => (
            <div className="piece" key={n.id}>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              <div className="meta">{new Date(n.created_at).toLocaleString()}</div>
            </div>
          ))}
        </article>
      </section>
    </Chrome>
  );
}
