import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 👇 MUY IMPORTANTE para que el navegador permita la solicitud
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  if (req.method !== "POST") return res.status(405).end();

  const body = req.body || {};
  let palancas = await redis.get("palancasData") || {};

  // Actualizar solo keys existentes
  for (const key in body) {
    if (palancas.hasOwnProperty(key)) palancas[key] = body[key];
  }

  await redis.set("palancasData", palancas);

  res.status(200).json({
    message: "Done",
    palancas
  });
}
