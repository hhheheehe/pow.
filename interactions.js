import nacl from "tweetnacl";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const publicKey = process.env.DISCORD_PUBLIC_KEY;

  if (!publicKey) {
    return res.status(500).send("DISCORD_PUBLIC_KEY is not configured");
  }

  try {
    const rawBody = await new Promise((resolve, reject) => {
      let body = "";

      req.setEncoding("utf8");

      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", () => resolve(body));
      req.on("error", reject);
    });

    const signature = req.headers["x-signature-ed25519"];
    const timestamp = req.headers["x-signature-timestamp"];

    if (!signature || !timestamp) {
      return res.status(401).send("Missing Discord signature");
    }

    const message = new TextEncoder().encode(timestamp + rawBody);

    const valid = nacl.sign.detached.verify(
      message,
      hexToBytes(signature),
      hexToBytes(publicKey)
    );

    if (!valid) {
      return res.status(401).send("Invalid request signature");
    }

    const interaction = JSON.parse(rawBody);

    // Discord endpoint verification
    if (interaction.type === 1) {
      return res.status(200).json({ type: 1 });
    }

    return res.status(200).json({
      type: 4,
      data: {
        content: "POWPOW bot is working!"
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(400).send("Bad Request");
  }
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }

  return bytes;
}
