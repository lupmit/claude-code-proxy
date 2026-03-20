import { app } from "./app";
import { env } from "./config/env";
import { geminiService } from "./services/gemini.service";

const server = app.listen(env.port, () => {
  console.log(`Server started on http://localhost:${env.port}`);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`Received ${signal}. Shutting down gracefully...`);

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
