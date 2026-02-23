// netlify/functions/nip05-webhook.js

const crypto = require("crypto");

exports.handler = async (event) => {
  console.log("Webhook modtaget:", event.httpMethod);
  console.log("Headers:", JSON.stringify(event.headers));
  console.log("Body:", event.body);

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!event.body) {
    console.error("Tom body modtaget");
    return { statusCode: 400, body: "Empty body" };
  }

  // Verificer BTCPayServer signatur
  const secret = process.env.BTCPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("BTCPAY_WEBHOOK_SECRET er ikke sat");
    return { statusCode: 500, body: "Missing webhook secret" };
  }

  const sigHeader = event.headers["btcpay-sig"] || "";
  const expectedSig =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(event.body).digest("hex");

  console.log("Modtaget signatur:", sigHeader);
  console.log("Forventet signatur:", expectedSig);

  if (sigHeader !== expectedSig) {
    console.error("Ugyldig signatur — anmodning afvist");
    return { statusCode: 401, body: "Unauthorized" };
  }

  // Parse payload
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    console.error("JSON parse fejl:", err);
    return { statusCode: 400, body: "Invalid JSON" };
  }

  console.log("Event type:", payload.type);

  // Handl kun når betaling er fuldt gennemført
  if (payload.type !== "InvoiceSettled") {
    return { statusCode: 200, body: "Ignored" };
  }

  const invoiceId = payload.invoiceId;
  console.log("Invoice ID:", invoiceId);

  // Hent den fulde faktura fra BTCPayServer
  const btcpayUrl = process.env.BTCPAY_URL;
  const btcpayApiKey = process.env.BTCPAY_API_KEY;
  const btcpayStoreId = process.env.BTCPAY_STORE_ID;

  console.log("Henter faktura fra BTCPayServer...");

  const invoiceResponse = await fetch(
    `${btcpayUrl}/api/v1/stores/${btcpayStoreId}/invoices/${invoiceId}`,
    {
      headers: {
        Authorization: `token ${btcpayApiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!invoiceResponse.ok) {
    console.error("Kunne ikke hente faktura:", invoiceResponse.status);
    return { statusCode: 500, body: "Invoice fetch failed" };
  }

  const invoice = await invoiceResponse.json();
  console.log("Faktura metadata:", JSON.stringify(invoice.metadata));

  const name = invoice.metadata?.nip05name?.toLowerCase().trim();
  const pubkey = invoice.metadata?.nip05pubkey?.trim();

  if (!name || !pubkey) {
    console.error("Mangler navn eller pubkey i faktura-metadata");
    return { statusCode: 400, body: "Missing form data" };
  }

  if (!/^[a-z0-9_-]+$/.test(name)) {
    console.error("Ugyldigt navneformat:", name);
    return { statusCode: 400, body: "Invalid name format" };
  }

  // Trigger GitHub Action
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;

  console.log("Trigger GitHub Action for:", name);

  const githubResponse = await fetch(
    `https://api.github.com/repos/${githubRepo}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "add-nip05",
        client_payload: { name, pubkey },
      }),
    }
  );

  if (!githubResponse.ok) {
    const errText = await githubResponse.text();
    console.error("GitHub dispatch fejlede:", errText);
    return { statusCode: 500, body: "GitHub trigger failed" };
  }

  console.log(`NIP-05 registrering sat i kø: ${name}`);
  return { statusCode: 200, body: "OK" };
};