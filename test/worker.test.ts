import { describe, expect, it } from "vitest";
import { handleRequest } from "../src/worker";

async function readJson(response: Response): Promise<any> {
  const text = await response.text();
  return JSON.parse(text);
}

describe("worker routes", () => {
  it("GET /health returns ok:true", async () => {
    const res = handleRequest(new Request("https://example.com/health", { method: "GET" }));
    expect(res.status).toBe(200);
    await expect(readJson(res)).resolves.toEqual({ ok: true });
  });

  it("GET /hello returns a greeting", async () => {
    const res = handleRequest(new Request("https://example.com/hello?name=Ada", { method: "GET" }));
    expect(res.status).toBe(200);
    await expect(readJson(res)).resolves.toEqual({ message: "Hello, Ada!" });
  });

  it("unknown route returns 404 with a hint message", async () => {
    const res = handleRequest(new Request("https://example.com/nope", { method: "GET" }));
    expect(res.status).toBe(404);
    await expect(readJson(res)).resolves.toEqual({
      message: "Welcome! Use /health for a health check and /hello?name=YourName for a greeting."
    });
  });

  it("non-GET returns 405", async () => {
    const res = handleRequest(new Request("https://example.com/health", { method: "POST" }));
    expect(res.status).toBe(405);
    await expect(readJson(res)).resolves.toEqual({ error: "Method Not Allowed" });
  });
});

