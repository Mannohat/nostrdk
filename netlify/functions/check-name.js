exports.handler = async (event) => {
    const name = event.queryStringParameters?.name?.toLowerCase().trim();
  
    if (!name || !/^[a-z0-9_-]+$/.test(name)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ugyldigt navneformat" }),
      };
    }
  
    try {
      const response = await fetch(`https://nostr.dk/.well-known/nostr.json`);
  
      if (!response.ok) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Kunne ikke læse nostr.json" }),
        };
      }
  
      const data = await response.json();
      const taken = Object.prototype.hasOwnProperty.call(data.names || {}, name);
  
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !taken, name }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Intern fejl" }),
      };
    }
  };