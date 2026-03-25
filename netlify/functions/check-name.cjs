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

  // Prøv flere mulige stier til nostr.json
  const possiblePaths = [
    path.join(__dirname, "..", "..", "public", ".well-known", "nostr.json"),
    path.join(process.cwd(), "public", ".well-known", "nostr.json"),
    "/var/task/public/.well-known/nostr.json",
  ];

  let data = null;

  for (const filePath of possiblePaths) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      data = JSON.parse(raw);
      console.log("Læste nostr.json fra:", filePath);
      break;
    } catch {
      console.log("Ingen fil på:", filePath);
    }
  }

  if (!data) {
    // Fallback: HTTP
    try {
      console.log("Prøver HTTP fallback...");
      const response = await fetch("https://nostr.dk/.well-known/nostr.json");
      if (!response.ok) throw new Error("HTTP fejl: " + response.status);
      data = await response.json();
    } catch (err) {
      console.error("HTTP fallback fejlede:", err.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Intern fejl" }),
      };
    }
  }

  const taken = Object.prototype.hasOwnProperty.call(data.names || {}, name);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ available: !taken, name }),
  };
};

