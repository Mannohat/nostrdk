const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const secret = process.env.BTCPAY_WEBHOOK_SECRET;
  const sigHeader = event.headers["btcpay-sig"] || "";
  const expectedSig =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(event.body).digest("hex");

  if (sigHeader !== expectedSig) {
    console.error("Ugyldig signatur — anmodning afvist");
    return { statusCode: 401, body: "Unauthorized" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  if (payload.type !== "InvoiceSettled") {
    return { statusCode: 200, body: "Ignored" };
  }

  const invoiceId = payload.invoiceId;

  const btcpayUrl = process.env.BTCPAY_URL;
  const btcpayApiKey = process.env.BTCPAY_API_KEY;
  const btcpayStoreId = process.env.BTCPAY_STORE_ID;

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
    console.error("Kunne ikke hente faktura fra BTCPayServer");
    return { statusCode: 500, body: "Invoice fetch failed" };
  }

  const invoice = await invoiceResponse.json();

  const name = invoice.metadata?.nip05name?.toLowerCase().trim();
  const pubkey = invoice.metadata?.nip05pubkey?.trim();

  if (!name || !pubkey) {
    console.error("Mangler navn eller pubkey i faktura-metadata");
    return { statusCode: 400, body: "Missing form data" };
  }

  if (!/^[a-z0-9_-]+$/.test(name)) {
    return { statusCode: 400, body: "Invalid name format" };
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;

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
    console.error("GitHub dispatch fejlede:", await githubResponse.text());
    return { statusCode: 500, body: "GitHub trigger failed" };
  }

  console.log(`NIP-05 registrering sat i kø: ${name}`);
  return { statusCode: 200, body: "OK" };
};