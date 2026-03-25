// Proxies https://nostr.dk/.well-known/nostr.json so the browser never calls
// nostr.dk directly (avoids CORS when developing on localhost via netlify dev).

const UPSTREAM = "https://nostr.dk/.well-known/nostr.json";

const jsonHeaders = { "Content-Type": "application/json" };

export const handler = async (event) => {
  if (event.httpMethod && event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const upstream = await fetch(UPSTREAM, {
      headers: { Accept: "application/json" },
    });

    if (!upstream.ok) {
      return {
        statusCode: 502,
        headers: jsonHeaders,
        body: JSON.stringify({ error: `Upstream HTTP ${upstream.status}` }),
      };
    }

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        statusCode: 502,
        headers: jsonHeaders,
        body: JSON.stringify({ error: "Invalid JSON from upstream" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        ...jsonHeaders,
        "Cache-Control": "public, max-age=120",
      },
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Kunne ikke hente nostr.json" }),
    };
  }
};
