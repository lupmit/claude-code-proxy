import express, { NextFunction, Request, Response } from "express";
import { testRouter } from "./routes/test.routes";

export const app = express();

app.use(express.json({ limit: "1mb" }));

app.use("/api", testRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : "Internal Server Error";

  res.status(500).json({
    success: false,
    message
  });
});
