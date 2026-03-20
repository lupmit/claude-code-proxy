import dotenv from "dotenv";

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  secure1psid: getRequiredEnv("SECURE_1PSID"),
  secure1psidts: getRequiredEnv("SECURE_1PSIDTS"),
  geminiInitTimeout: Number(process.env.GEMINI_INIT_TIMEOUT ?? 300),
  geminiAutoRefresh: (process.env.GEMINI_AUTO_REFRESH ?? "true") === "true"
};
