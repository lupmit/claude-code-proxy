import { GeminiClient, Model } from "@lupmit/gemini-api";
import { env } from "../config/env";

class GeminiService {
  private client: GeminiClient | null = null;
  private initializing: Promise<void> | null = null;

  private async ensureClientInitialized(): Promise<GeminiClient> {
    if (this.client) {
      return this.client;
    }

    if (!this.initializing) {
      this.client = new GeminiClient({
        secure1psid: env.secure1psid,
        secure1psidts: env.secure1psidts
      });

      this.initializing = this.client.init({
        timeout: env.geminiInitTimeout,
        autoRefresh: env.geminiAutoRefresh
      });
    }

    await this.initializing;
    return this.client as GeminiClient;
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
