import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id,email");

  if (error) {
    return NextResponse.json(error);
  }

  for (const user of users) {
    const { data: docs } = await supabase
      .from("documents")
      .select("title,expiry_date")
      .eq("user_id", user.id);

    if (!docs || docs.length === 0) continue;

    const expiring = docs.filter((doc) => {
      const diff = Math.floor(
        (new Date(doc.expiry_date).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      );

      return diff <= 30;
    });

    if (expiring.length === 0) continue;

    const html = `
      <h2>Salut!</h2>

      <p>Ai documente care necesită atenție:</p>

      <ul>
        ${expiring
          .map(
            (d) => `
            <li>
              <strong>${d.title}</strong>
              - expiră la ${d.expiry_date}
            </li>
          `
          )
          .join("")}
      </ul>

      <p>Intră în RemindDocs pentru detalii.</p>
    `;

    await resend.emails.send({
      from: "RemindDocs <onboarding@resend.dev>",
      to: user.email,
      subject: "RemindDocs - Documente care expiră",
      html,
    });
  }

  return NextResponse.json({
    success: true,
  });
}