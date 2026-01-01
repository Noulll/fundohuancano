import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method !== "GET") return res.status(405).end();

  let palancas = await redis.get("palancasData");

  // Si no existe aún, creamos una tabla inicial
  if (!palancas) {
    palancas = {
      "1palanca": false,
      "2palanca": false,
      "3palanca": false,
      "4palanca": false,
      "5palanca": false
    };
    await redis.set("palancasData", palancas);
  }

  res.status(200).json(palancas);
}
