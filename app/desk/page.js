"use client";
import { useEffect, useState } from "react";
import Chrome from "@/components/Chrome";
import { supabase } from "@/lib/supabase";

export default function Desk() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [msg, setMsg] = useState("");

  async function load(uid) {
    const { data } = await supabase.from("wellroom_notes").select("*").eq("author_id", uid).order("created_at", { ascending: false });
    setNotes(data || []);
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = "/login";
        return;
      }
      setUser(data.user);
      const handle = (data.user.email || "reader").split("@")[0].slice(0, 22);
      await supabase.from("wellroom_profiles").upsert({ id: data.user.id, handle, display_name: handle });
      await load(data.user.id);
    })();
  }, []);

  async function save(e) {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("wellroom_notes").insert({
      author_id: user.id,
      title: title.trim() || "Untitled slip",
      body: body.trim(),
      is_public: isPublic,
    });
    if (error) {
      setMsg(error.message);
      return;
    }
    setTitle("");
    setBody("");
    setIsPublic(false);
    setMsg("Saved.");
    await load(user.id);
  }

  async function toggle(note) {
    await supabase.from("wellroom_notes").update({ is_public: !note.is_public }).eq("id", note.id);
    await load(user.id);
  }

  async function remove(id) {
    await supabase.from("wellroom_notes").delete().eq("id", id);
    await load(user.id);
  }

  async function leave() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <Chrome>
      <section className="hero">
        <div>
          <div className="kicker">Your drawer</div>
          <h2 className="lede">Write it down.</h2>
          <p className="sub">Keep it private or set it on the stoop. Public slips are visible to anyone walking by.</p>
        </div>
        <button className="btn ghost" onClick={leave}>Sign out</button>
      </section>
      <section className="grid">
        <form className="card span-5" onSubmit={save}>
          <label className="meta">Title</label>
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="meta">Note</label>
          <textarea className="field" rows={8} required value={body} onChange={(e) => setBody(e.target.value)} />
          <label className="check">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            Mark public
          </label>
          <button className="btn" type="submit">Save slip</button>
          {msg && <p className="sub">{msg}</p>}
        </form>
        <article className="card span-7">
          <div className="meta">{notes.length} saved</div>
          <h2>Drawer</h2>
          {notes.map((n) => (
            <div className="piece" key={n.id}>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              <div className="row">
                <span className="meta">{n.is_public ? "On the stoop" : "In the drawer"}</span>
                <button className="btn ghost" type="button" onClick={() => toggle(n)}>{n.is_public ? "Make private" : "Make public"}</button>
                <button className="btn ghost" type="button" onClick={() => remove(n.id)}>Delete</button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </Chrome>
  );
}
