import { app } from "./app.js";
import { env } from "./config/env.js";
import { geminiService } from "./services/gemini.service.js";

let server: ReturnType<typeof app.listen> | null = null;

async function shutdown(signal: string): Promise<void> {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  if (!server) {
    await geminiService.close();
    process.exit(0);
  }

  server.close(async () => {
    try {
      await geminiService.close();
      console.log("Server closed.");
      process.exit(0);
    } catch (error) {
      console.error("Error while shutting down:", error);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

async function bootstrap(): Promise<void> {
  try {
    await geminiService.init();
    console.log("Gemini client initialized.");

    server = app.listen(env.port, () => {
      console.log(`Server started on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
    process.exit(1);
  }
}

void bootstrap();
