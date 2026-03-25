// netlify/functions/create-nip05-invoice.cjs

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let name, pubkey;
  try {
    const body = JSON.parse(event.body);
    name = body.name?.toLowerCase().trim();
    pubkey = body.pubkey?.trim();
  } catch (err) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  if (!name || !pubkey) {
    return { statusCode: 400, body: "Missing name or pubkey" };
  }

  if (!/^[a-z0-9_-]+$/.test(name)) {
    return { statusCode: 400, body: "Invalid name format" };
  }

  const btcpayUrl = process.env.BTCPAY_URL;
  const btcpayApiKey = process.env.BTCPAY_API_KEY;
  const btcpayStoreId = process.env.BTCPAY_STORE_ID;

  try {
    const response = await fetch(
      `${btcpayUrl}/api/v1/stores/${btcpayStoreId}/invoices`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${btcpayApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: "2100",
          currency: "SATS",
          metadata: {
            nip05name: name,
            nip05pubkey: pubkey,
          },
          checkout: {
            redirectURL: "https://nostr.dk",
            redirectAutomatically: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("BTCPay fejl:", err);
      return { statusCode: 500, body: "Invoice creation failed" };
    }

    const invoice = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ checkoutLink: invoice.checkoutLink }),
    };
  } catch (err) {
    console.error("Fetch fejl:", err);
    return { statusCode: 500, body: "Server error" };
  }
};

