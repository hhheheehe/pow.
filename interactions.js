import nacl from "tweetnacl";

const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

function hexToUint8(hex) {
  if (!hex || hex.length % 2) throw new Error("Invalid hex");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!PUBLIC_KEY) {
    return res.status(500).json({ error: "DISCORD_PUBLIC_KEY is not configured" });
  }

  try {
    // Discord requires signature verification against the exact raw request body.
    const rawBody = await new Promise((resolve, reject) => {
      let data = "";
      req.setEncoding("utf8");
      req.on("data", chunk => { data += chunk; });
      req.on("end", () => resolve(data));
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
      hexToUint8(signature),
      hexToUint8(PUBLIC_KEY)
    );

    if (!valid) return res.status(401).send("Invalid request signature");

    const interaction = JSON.parse(rawBody);

    // Discord's initial endpoint verification request.
    if (interaction.type === 1) {
      return res.status(200).json({ type: 1 });
    }

    // Slash-command handling can be expanded without changing endpoint verification.
    if (interaction.type === 2) {
      const name = interaction.data?.name;
      if (name === "info") {
        return res.status(200).json({
          type: 4,
          data: {
            content: "POWPOW roster bot is online."
          }
        });
      }
      if (name === "lol") {
        return res.status(200).json({
          type: 4,
          data: { content: "lol" }
        });
      }
      return res.status(200).json({
        type: 4,
        data: { content: `/${name || "command"} received.` }
      });
    }

    return res.status(200).json({ type: 1 });
  } catch (err) {
    console.error("Discord interaction error:", err);
    return res.status(400).send("Bad Request");
  }
}
