import { ORDINANCE_FILENAME, ORDINANCE_TEXT } from "@/lib/ordinance";

export function GET() {
  return new Response(ORDINANCE_TEXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${ORDINANCE_FILENAME}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
