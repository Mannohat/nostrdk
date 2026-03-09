const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const name = event.queryStringParameters?.name?.toLowerCase().trim();

  if (!name || !/^[a-z0-9_-]+$/.test(name)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Ugyldigt navneformat" }),
    };
  }

  try {
    // Netlify Functions har adgang til projektets filer via process.cwd()
    const filePath = path.join(process.cwd(), "public", ".well-known", "nostr.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    const taken = Object.prototype.hasOwnProperty.call(data.names || {}, name);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !taken, name }),
    };
  } catch (err) {
    console.error("Fejl ved læsning af nostr.json:", err.message);
    // Fallback: prøv HTTP hvis filsystem ikke virker
    try {
      const response = await fetch("https://nostr.dk/.well-known/nostr.json");
      if (!response.ok) throw new Error("HTTP fejl");
      const data = await response.json();
      const taken = Object.prototype.hasOwnProperty.call(data.names || {}, name);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !taken, name }),
      };
    } catch (fallbackErr) {
      console.error("Fallback fejl:", fallbackErr.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Intern fejl" }),
      };
    }
  }
};