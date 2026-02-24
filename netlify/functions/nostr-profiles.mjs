// netlify/functions/nostr-profiles.mjs
// ES module version — krævet når package.json har "type": "module"

import { WebSocket } from "ws";

const RELAYS = [
  "wss://relay.primal.net",
  "wss://relay.nostr.band",
  "wss://nos.lol",
];

const TIMEOUT_MS = 8000;

export const handler = async (event) => {
  const params = event.queryStringParameters || {};
  const pubkeysParam = params.pubkeys;

  if (!pubkeysParam) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Mangler pubkeys parameter" }),
    };
  }

  const pubkeys = pubkeysParam.split(",").filter(k => /^[0-9a-f]{64}$/.test(k));

  if (pubkeys.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Ingen gyldige pubkeys" }),
    };
  }

  const profiles = {};

  await new Promise((resolve) => {
    let remaining = pubkeys.length;
    let settled = false;

    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    const timer = setTimeout(done, TIMEOUT_MS);

    for (const relayUrl of RELAYS) {
      try {
        const ws = new WebSocket(relayUrl);
        const subId = "p" + Math.random().toString(36).slice(2, 8);

        ws.on("open", () => {
          ws.send(JSON.stringify([
            "REQ", subId,
            { kinds: [0], authors: pubkeys, limit: pubkeys.length }
          ]));
        });

        ws.on("message", (data) => {
          try {
            const msg = JSON.parse(data.toString());
            if (msg[0] === "EOSE") { ws.close(); return; }
            if (msg[0] !== "EVENT" || msg[2]?.kind !== 0) return;

            const pubkey = msg[2].pubkey;
            if (profiles[pubkey]) return;

            const content = JSON.parse(msg[2].content);
            profiles[pubkey] = {
              picture: content.picture || null,
              display_name: content.display_name || content.name || null,
            };

            remaining--;
            if (remaining <= 0) {
              clearTimeout(timer);
              done();
            }
          } catch {}
        });

        ws.on("error", () => {});
      } catch {}
    }
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
    body: JSON.stringify(profiles),
  };
};
