import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { copyForHour, hourKey } from "@/lib/hours";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const key = hourKey();
  const [headline, blurb] = copyForHour();
  const { data: publicNote } = await supabase.from("wellroom_notes").select("id,title,body").eq("is_public", true).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const payload = {
    hour_key: key,
    headline: publicNote ? `Featured: ${publicNote.title}` : headline,
    blurb: publicNote ? publicNote.body.slice(0, 280) : blurb,
    note_id: publicNote?.id || null,
  };
  const { error } = await supabase.from("wellroom_hours").upsert(payload, { onConflict: "hour_key" });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, ...payload });
}
