import { auth } from "@/app/(auth)/auth";
import { getLightById, setLightState } from "@/lib/hue/client";
import { ChatbotError } from "@/lib/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:api").toResponse();
  }

  const { id } = await params;
  const light = await getLightById(id);
  return Response.json(light);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:api").toResponse();
  }

  let body: { on?: boolean; bri?: number; hue?: number; sat?: number };
  try {
    body = await request.json();
  } catch {
    return new ChatbotError("bad_request:api").toResponse();
  }

  const { id } = await params;
  const result = await setLightState(id, body);
  return Response.json(result);
}
