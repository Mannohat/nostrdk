// netlify/functions/suggest-resource.cjs
// Opretter et GitHub Issue i præcis det format som auto-create-resource-pr.yml forventer.

exports.handler = async (event) => {
  // Kun POST tilladt
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "https://nostr.dk",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Ugyldigt JSON" }) };
  }

  const { name, url, description, type } = body;

  // Valider påkrævede felter
  if (!name || !url || !description || !type) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Navn, URL, type og beskrivelse er påkrævet" }),
    };
  }
  const allowedTypes = new Set([
    "client",
    "wallet",
    "tool",
    "extension",
    "relay",
    "marketplace",
    "publishing",
    "streaming",
    "service",
  ]);
  if (!allowedTypes.has(type)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Ugyldig type" }),
    };
  }

  // Simpel URL-validering
  try {
    new URL(url);
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Ugyldig URL – husk https://" }),
    };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO || "Mannohat/nostrdk";

  if (!GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN mangler i miljøvariablerne");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server-konfigurationsfejl" }),
    };
  }

  // Vi afleder kategori fra type, så brugeren kun udfylder det nødvendige.
  const categoryLabels = {
    "nostr-alternatives": "🔄 Nostr Alternativer (nostr-alternatives)",
    services: "⚡ Nostr Services (services)",
    extensions: "🔌 Browser Udvidelser (extensions)",
    tools: "🛠️ Nostr Værktøjer (tools)",
    relays: "🌐 Nostr Relays (relays)",
  };
  const categoryKeyByType = {
    extension: "extensions",
    relay: "relays",
    tool: "tools",
  };
  const categoryKey = categoryKeyByType[type] || "services";
  const categoryLabel = categoryLabels[categoryKey] || categoryLabels.services;

  const issueBody = [
    `### Ressource Navn / Resource Name`,
    ``,
    name,
    ``,
    `### URL`,
    ``,
    url,
    ``,
    `### Kategori / Category`,
    ``,
    categoryLabel,
    ``,
    `### Type`,
    ``,
    type,
    ``,
    `### Beskrivelse / Description`,
    ``,
    description,
    ``,
    `### Hvorfor? / Why?`,
    ``,
    `Indsendt via forslagsformularen på nostr.dk`,
    ``,
    `---`,
    `*Indsendt via nostr.dk modal*`,
  ].join("\n");

  try {
    // Tjek om der allerede eksisterer et åbent issue med samme URL
    const searchResponse = await fetch(
      `https://api.github.com/search/issues?q=repo:${GITHUB_REPO}+is:issue+is:open+${encodeURIComponent(url)}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.total_count > 0) {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({
            error: `Der er allerede et forslag med denne URL – det bliver behandlet hurtigst muligt.`,
          }),
        };
      }
    }

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `[RESSOURCE] ${name}`,
        body: issueBody,
        labels: ["ressource-forslag", "needs-review"],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("GitHub API fejl:", err);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "Kunne ikke oprette issue på GitHub" }),
      };
    }

    const issue = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        issueUrl: issue.html_url,
        issueNumber: issue.number,
      }),
    };
  } catch (err) {
    console.error("Netværksfejl:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Netværksfejl – prøv igen" }),
    };
  }
};

