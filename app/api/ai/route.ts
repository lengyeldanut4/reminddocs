import { NextResponse } from "next/server";

/**
 * 🧠 ULTRA PRO INTENT ENGINE
 */
function detectIntent(text: string) {
  const t = text.toLowerCase();

  // COUNT
  if (/(câte|cate|numar|total|how many)/.test(t)) return "count";

  // ACTIVE
  if (/(active|valide|în regulă|ok)/.test(t)) return "active";

  // EXPIRED
  if (/(expirat|expirate|invalid)/.test(t)) return "expired";

  // SOON
  if (/(curând|soon|apropie|expira)/.test(t)) return "soon";

  // SUMMARY
  if (/(rezumat|summary|overview)/.test(t)) return "summary";

  // HELP
  if (/(ajutor|help|ce pot|ce poti)/.test(t)) return "help";

  // ADVICE
  if (/(ce trebuie|ce sa fac|what should)/.test(t)) return "advice";

  return "chat";
}

/**
 * 🧠 SMART NATURAL RESPONSE ENGINE
 */
function buildReply(intent: string, docs: any[]) {
  const now = new Date();

  const total = docs.length;

  const expired = docs.filter(
    (d) => new Date(d.expiry_date) < now
  );

  const active = docs.filter(
    (d) => new Date(d.expiry_date) >= now
  );

  const soon = docs.filter((d) => {
    const diff =
      (new Date(d.expiry_date).getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff > 0 && diff <= 30;
  });

  // 🧠 HUMAN STYLE RESPONSES (ULTRA PRO)
  switch (intent) {
    case "count":
      return `Ai ${total} documente în sistem.`;

    case "active":
      return `În acest moment ai ${active.length} documente active și valide.`;

    case "expired":
      return `Ai ${expired.length} documente expirate care necesită atenție.`;

    case "soon":
      return `Ai ${soon.length} documente care expiră în următoarele 30 de zile.`;

    case "summary":
      return `📊 Rezumat complet:
• Total: ${total}
• Active: ${active.length}
• Expirate: ${expired.length}
• Aproape de expirare: ${soon.length}`;

    case "help":
      return `Poți întreba:
• câte documente am
• ce este activ
• ce a expirat
• rezumat general`;

    case "advice":
      if (expired.length > 0) {
        return `⚠️ Ai ${expired.length} documente expirate. Recomand să le rezolvi cât mai curând.`;
      }

      if (soon.length > 0) {
        return `⏳ Ai ${soon.length} documente care expiră curând. Ar fi bine să le verifici din timp.`;
      }

      return `✅ Totul arată bine. Nu ai acțiuni urgente în acest moment.`;

    case "chat":
    default:
      return `Îți pot analiza documentele. Încearcă întrebări precum: câte documente am, ce este expirat sau rezumat.`;
  }
}

/**
 * 🚀 API ROUTE
 */
export async function POST(req: Request) {
  try {
    const { messages, documents } = await req.json();

    const lastMessage =
      messages?.[messages.length - 1]?.content || "";

    const intent = detectIntent(lastMessage);

    const reply = buildReply(intent, documents || []);

    return NextResponse.json({
      reply,
      intent, // 🔥 debug useful
    });
  } catch (err) {
    return NextResponse.json({
      reply: "Eroare AI ULTRA PRO",
    });
  }
}