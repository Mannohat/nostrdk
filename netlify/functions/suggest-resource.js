// netlify/functions/suggest-resource.js
// Opretter et GitHub Issue i præcis det format som auto-create-resource-pr.yml forventer.
//
// Workflowen kræver:
//   - Label:  "ressource-forslag"  (+ "needs-review")
//   - Body:   ### Feltnavne der matches med parseField() i workflowen

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

  const { name, url, category, description } = body;

  // Valider påkrævede felter
  if (!name || !url || !description) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Navn, URL og beskrivelse er påkrævet" }),
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
  const GITHUB_REPO = process.env.GITHUB_REPO || "Mannohat/nostrdk"; // ← ret til dit repo

  if (!GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN mangler i miljøvariablerne");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server-konfigurationsfejl" }),
    };
  }

  // Kategori-værdier skal matche PRÆCIS de strenge workflowen bruger i categoryMap
  const categoryLabels = {
    "nostr-alternatives": "🔄 Nostr Alternativer (nostr-alternatives)",
    "services":           "⚡ Nostr Services (services)",
    "extensions":         "🔌 Browser Udvidelser (extensions)",
    "tools":              "🛠️ Nostr Værktøjer (tools)",
    "relays":             "🌐 Nostr Relays (relays)",
  };
  const categoryLabel = categoryLabels[category] || "🔄 Nostr Alternativer (nostr-alternatives)";

  // Issue body SKAL bruge ### overskrifter som workflowens parseField() forventer.
  // Felterne: "Ressource Navn / Resource Name", "URL", "Kategori / Category",
  //           "Section Tag (valgfri / optional)", "Beskrivelse / Description"
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
    `### Section Tag (valgfri / optional)`,
    ``,
    ``,
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
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `[RESSOURCE] ${name}`,                          // matcher workflowens title-prefix
          body: issueBody,
          labels: ["ressource-forslag", "needs-review"],         // PRÆCIS de labels workflowen lytter efter
        }),
      }
    );

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
