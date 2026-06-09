import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());

app.use(express.json({
  verify: (req, _res, buf) => {
    (req as any).rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: true }));

async function initDb() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        original_price NUMERIC(10,2) NOT NULL,
        description TEXT NOT NULL,
        short_description TEXT NOT NULL,
        featured BOOLEAN NOT NULL DEFAULT false,
        is_new BOOLEAN NOT NULL DEFAULT false,
        is_trending BOOLEAN NOT NULL DEFAULT false,
        badge TEXT,
        image_url TEXT,
        benefits JSONB NOT NULL DEFAULT '[]',
        emotional_benefits JSONB NOT NULL DEFAULT '[]',
        ingredients TEXT,
        usage TEXT,
        reviews JSONB NOT NULL DEFAULT '[]',
        faq JSONB NOT NULL DEFAULT '[]',
        related_product_slugs JSONB NOT NULL DEFAULT '[]'
      )
    `);
    await db.execute(sql`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT
    `);
    logger.info("✅ Database initialized");
  } catch (err) {
    logger.error({ err }, "❌ Database init failed");
  }
}

initDb().catch(err => logger.error({ err }, "DB init error"));

app.use("/api", router);

export default app;
