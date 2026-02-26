import { getDreamEntryByShareToken } from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";

/**
 * GET /api/dreams/shared?token=<shareToken>
 * Public endpoint – retrieves a shared dream entry by its share token.
 * No authentication required (the token acts as a capability credential).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  const entry = await getDreamEntryByShareToken({ shareToken: token });

  if (!entry || !entry.isShared) {
    return Response.json({ error: "Dream not found or not shared" }, { status: 404 });
  }

  return Response.json({ dreamEntry: entry });
}
