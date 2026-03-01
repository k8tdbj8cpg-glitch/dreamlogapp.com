import { auth } from "@/app/(auth)/auth";
import { listLights } from "@/lib/hue/client";
import { ChatbotError } from "@/lib/errors";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:api").toResponse();
  }

  const lights = await listLights();
  return Response.json(lights);
}
