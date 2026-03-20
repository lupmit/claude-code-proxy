import { Router } from "express";
import { geminiService } from "../services/gemini.service";

type GenerateBody = {
  prompt?: string;
  model?: string;
};

export const testRouter = Router();

testRouter.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});

testRouter.post("/test/generate", async (req, res, next) => {
  try {
    const body = req.body as GenerateBody;

    if (!body.prompt || typeof body.prompt !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid payload. 'prompt' must be a non-empty string."
      });
      return;
    }

    const reply = await geminiService.generate(body.prompt, body.model);

    res.status(200).json({
      success: true,
      data: {
        prompt: body.prompt,
        model: body.model ?? "default",
        reply
      }
    });
  } catch (error) {
    next(error);
  }
});
