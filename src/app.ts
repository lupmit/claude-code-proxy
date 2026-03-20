import express, { NextFunction, Request, Response } from "express";
import { apiLogger } from "./middlewares/api-logger.js";
import { testRouter } from "./routes/test.routes.js";

export const app = express();

app.use(apiLogger);
app.use(express.json({ limit: "1mb" }));

app.use("/api", testRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : "Internal Server Error";
  const requestId = (res.locals.requestId as string | undefined) ?? "unknown";

  console.error(`ERROR ${req.method} ${req.originalUrl} [${requestId}] ${message}`);

  res.status(500).json({
    success: false,
    message,
    requestId
  });
});
