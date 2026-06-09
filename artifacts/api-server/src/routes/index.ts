import { Router, type Router as RouterType } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import bundlesRouter from "./bundles";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import contactRouter from "./contact";
import checkoutRouter from "./checkout";
import { db, productsTable } from "@workspace/db";

const router: RouterType = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(bundlesRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(contactRouter);
router.use(checkoutRouter);

router.get("/seed-products", async (req, res) => {
  await db.delete(productsTable);
  await db.insert(productsTable).values([
    {
      slug: "gant-deshedding-petcare",
      name: "Gant de Déshedding PetCare",
      price: "12.99",
      originalPrice: "19.99",
      shortDescription: "Élimine les poils en excès en douceur",
      description: "Le gant de déshedding PetCare retire efficacement les poils morts de votre animal tout en le massant doucement.",
      featured: true,
      isNew: false,
      isTrending: true,
      badge: "Viral TikTok",
      imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500",
      benefits: ["Élimine 95% des poils", "Massage relaxant", "Compatible tous animaux"],
      emotionalBenefits: ["Canapé propre", "Animal détendu", "Maison sans poils"],
      usage: "Mouvements circulaires sur le pelage.",
      reviews: [{ id: 1, author: "Marie L.", city: "Lyon", rating: 5, comment: "Incroyable !" }],
      faq: [{ question: "Compatible tous animaux ?", answer: "Oui, chiens et chats." }],
      relatedProductSlugs: ["brosse-anti-poils-petcare", "lint-roller-petcare"],
    },
    {
      slug: "brosse-anti-poils-petcare",
      name: "Brosse Anti-Poils PetCare",
      price: "14.99",
      originalPrice: "22.99",
      shortDescription: "Brosse professionnelle pour un pelage sain",
      description: "Démêle et lisse le pelage tout en éliminant les poils morts.",
      featured: true,
      isNew: true,
      isTrending: false,
      badge: "NOUVEAU",
      imageUrl: "https://images.unsplash.com/photo-1601758174493-45d0a4d2e007?w=500",
      benefits: ["Démêle sans douleur", "Réduit les nœuds", "Pelage brillant"],
      emotionalBenefits: ["Animal confortable", "Routine agréable"],
      usage: "Brossez dans le sens du pelage 5 minutes par jour.",
      reviews: [{ id: 1, author: "Sophie M.", city: "Bruxelles", rating: 5, comment: "Mon chat adore !" }],
      faq: [{ question: "Convient aux poils longs ?", answer: "Oui, idéale pour poils longs." }],
      relatedProductSlugs: ["gant-deshedding-petcare", "lint-roller-petcare"],
    },
    {
      slug: "lint-roller-petcare",
      name: "Lint Roller Anti-Poils PetCare",
      price: "24.99",
      originalPrice: "34.99",
      shortDescription: "Éliminez les poils de vos vêtements instantanément",
      description: "Élimine instantanément les poils de vos vêtements et canapés. Réutilisable et écologique.",
      featured: false,
      isNew: false,
      isTrending: true,
      badge: null,
      imageUrl: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=500",
      benefits: ["Élimine 100% des poils", "Réutilisable", "Écologique"],
      emotionalBenefits: ["Vêtements propres", "Prêt en 30 secondes"],
      usage: "Va-et-vient sur le tissu.",
      reviews: [{ id: 1, author: "Julie M.", city: "Lyon", rating: 5, comment: "Indispensable !" }],
      faq: [{ question: "Lavable ?", answer: "Oui, rincez sous l'eau." }],
      relatedProductSlugs: ["gant-deshedding-petcare", "brosse-anti-poils-petcare"],
    },
  ]);
  res.json({ success: true, message: "✅ 3 produits insérés avec images !" });
});

export default router;
