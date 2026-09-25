"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Chrome({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user || null));
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <div className="wrap">
      <nav className="nav">
        <Link className="brand" href="/">Porchlight</Link>
        <div className="links">
          <Link href="/stoop">Stoop</Link>
          <Link href="/desk">Desk</Link>
          <Link href={user ? "/desk" : "/login"}>{user ? "Signed in" : "Enter"}</Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
