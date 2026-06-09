async function initDb() {
  try {
    await db.execute(sql`DROP TABLE IF EXISTS products`);
    await db.execute(sql`
      CREATE TABLE products (
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
    logger.info("✅ Database initialized");
  } catch (err) {
    logger.error({ err }, "❌ Database init failed");
  }
}
