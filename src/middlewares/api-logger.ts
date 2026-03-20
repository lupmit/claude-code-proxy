import { randomUUID } from "node:crypto";
import { NextFunction, Request, Response } from "express";

export function apiLogger(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationNs = process.hrtime.bigint() - start;
    const durationMs = Number(durationNs) / 1_000_000;
    const statusCode = res.statusCode;

    const line = `${req.method} ${req.originalUrl} ${statusCode} ${durationMs.toFixed(1)}ms`;
    if (statusCode >= 500) {
      console.error(line);
      return;
    }

    console.log(line);
  });

  next();
}
