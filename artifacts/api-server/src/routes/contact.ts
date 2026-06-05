import { Router } from "express";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const parsed = SubmitContactBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed" }); return;
    }
    const { name, email, message } = parsed.data;
    req.log.info({ name, email }, "Contact form submission received");
    res.json({ success: true, message: "Votre message a bien été reçu. Nous vous répondrons dans les plus brefs délais." });
  } catch (err) {
    req.log.error({ err }, "Failed to process contact form");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
