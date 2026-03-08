function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function handleRequest(request: Request): Response {
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return json({ error: "Method Not Allowed" }, { status: 405 });
  }

  if (url.pathname === "/health") {
    return json({ ok: true });
  }

  if (url.pathname === "/hello") {
    const name = url.searchParams.get("name") ?? "world";
    return json({ message: `Hello, ${name}!` });
  }

  return json(
    {
      message: "Welcome! Use /health for a health check and /hello?name=YourName for a greeting."
    },
    { status: 404 }
  );
}

export default {
  fetch(request: Request): Response | Promise<Response> {
    return handleRequest(request);
  }
};

