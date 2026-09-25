"use client";
import { useState } from "react";
import Chrome from "@/components/Chrome";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function ensureProfile(user) {
    if (!user) return;
    const handle = (user.email || "reader").split("@")[0].slice(0, 22);
    await supabase.from("wellroom_profiles").upsert({ id: user.id, handle, display_name: handle });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        await ensureProfile(data.user);
        setMsg(data.session ? "Desk is open." : "Confirm the email, then come back.");
        if (data.session) window.location.href = "/desk";
      } else if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
        });
        if (error) throw error;
        setMsg("A link is on its way.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await ensureProfile(data.user);
        window.location.href = "/desk";
      }
    } catch (err) {
      setMsg(err.message || "That did not take.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Chrome>
      <section className="hero">
        <div>
          <div className="kicker">Members</div>
          <h2 className="lede">{mode === "signup" ? "Take a chair." : "Come back in."}</h2>
          <p className="sub">Password or a quiet email link. Private notes stay in the drawer until you flip the porch light on.</p>
        </div>
      </section>
      <form className="card" style={{ maxWidth: 480 }} onSubmit={onSubmit}>
        <label className="meta">Email</label>
        <input className="field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {mode !== "magic" && (
          <>
            <label className="meta">Password</label>
            <input className="field" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
          </>
        )}
        <div className="row">
          <button className="btn" disabled={busy} type="submit">{busy ? "One moment" : mode === "signup" ? "Open a desk" : mode === "magic" ? "Send the link" : "Enter"}</button>
          <button className="btn ghost" type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Need a desk?" : "I already have one"}</button>
          <button className="btn ghost" type="button" onClick={() => setMode("magic")}>Email link</button>
        </div>
        {msg && <p className="sub">{msg}</p>}
      </form>
    </Chrome>
  );
}
