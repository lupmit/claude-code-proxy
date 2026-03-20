import { GeminiClient, Model } from "@lupmit/gemini-api";
import { env } from "../config/env.js";

class GeminiService {
  private client: GeminiClient | null = null;
  private initializing: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.client || this.initializing) {
      await this.initializing;
      return;
    }

    if (!this.initializing) {
      this.initializing = (async () => {
        this.client = new GeminiClient({
          secure1psid: env.secure1psid,
          secure1psidts: env.secure1psidts
        });

        await this.client.init({
          timeout: env.geminiInitTimeout,
          autoRefresh: env.geminiAutoRefresh
        });
      })();
    }

    await this.initializing;
  }

  private async ensureClientInitialized(): Promise<GeminiClient> {
    if (this.client) {
      return this.client;
    }

    await this.init();
    if (!this.client) {
      throw new Error("Gemini client initialization failed");
    }

    return this.client;
  }

  async generate(prompt: string, modelName?: string): Promise<string> {
    const client = await this.ensureClientInitialized();
    const model = modelName ? Model.fromName(modelName) : undefined;

    const output = await client.generateContent(prompt, {
      model
    });

    return output.text;
  }

  async close(): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.client.close();
    this.client = null;
    this.initializing = null;
  }
}

export const geminiService = new GeminiService();
