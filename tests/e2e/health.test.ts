import { expect, test } from "@playwright/test";

test.describe("Health API", () => {
  test("GET /api/health returns 401 when unauthenticated", async ({
    request,
  }) => {
    const response = await request.get("/api/health");

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.code).toBe("unauthorized:health");
  });

  test("POST /api/health returns 401 when unauthenticated", async ({
    request,
  }) => {
    const response = await request.post("/api/health", {
      data: {
        sleepStart: "2025-01-01T22:00:00Z",
        sleepEnd: "2025-01-02T06:00:00Z",
      },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.code).toBe("unauthorized:health");
  });

  test("GET /ping returns 200 ok", async ({ request }) => {
    const response = await request.get("/ping");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
  });
});
