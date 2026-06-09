import { db, productsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding products...");

  await db.delete(productsTable);

  await db.insert(productsTable).values([
    {
      slug: "gant-deshedding-petcare",
      name: "Gant de Déshedding PetCare",
      price: "12.99",
      originalPrice: "19.99",
      shortDescription: "Élimine les poils en excès en douceur",
      description: "Le gant de déshedding PetCare retire efficacement les poils morts de votre animal tout en le massant doucement. Compatible chiens et chats.",
      featured: true,
      isNew: false,
      isTrending: true,
      badge: "Viral TikTok",
      imageUrl: "https://res.cloudinary.com/df8gsalta/image/upload/v1781010418/Screenshot_20260605-075925-405_oso9nt.png",
      colors: ["#0000FF", "#FFC0CB", "#008000", "#000000"], // Bleu, Rose, Vert, Noir
      benefits: ["Élimine 95% des poils", "Massage relaxant", "Compatible tous animaux"],
      emotionalBenefits: ["Canapé propre", "Animal détendu", "Maison sans poils"],
      ingredients: null,
      usage: "Passez le gant sur le pelage de votre animal en effectuant des mouvements circulaires.",
      reviews: [
        { id: 1, author: "Marie L.", city: "Lyon", rating: 5, comment: "Incroyable, mon canapé est enfin propre !" },
        { id: 2, author: "Thomas R.", city: "Paris", rating: 5, comment: "Mon golden retriever adore les séances de brossage." }
      ],
      faq: [
        { question: "Compatible avec tous les animaux ?", answer: "Oui, compatible chiens et chats de toutes tailles." }
      ],
      relatedProductSlugs: ["brosse-anti-poils-petcare", "lint-roller-petcare"],
    },
    {
      slug: "brosse-anti-poils-petcare",
      name: "Brosse Anti-Poils PetCare",
      price: "14.99",
      originalPrice: "22.99",
      shortDescription: "Brosse professionnelle pour un pelage sain",
      description: "La brosse anti-poils PetCare démêle et lisse le pelage de votre animal tout en éliminant les poils morts. Résultat professionnel à domicile.",
      featured: true,
      isNew: true,
      isTrending: false,
      badge: "NOUVEAU",
      imageUrl: "https://res.cloudinary.com/df8gsalta/image/upload/v1781010420/Screenshot_20260605-085404-055_xasm8g.png",
      colors: ["#0000FF", "#FFC0CB", "#008000"], // Bleu, Rose, Vert
      benefits: ["Démêle sans douleur", "Réduit les nœuds", "Pelage brillant"],
      emotionalBenefits: ["Animal confortable", "Routine agréable", "Résultats visibles"],
      ingredients: null,
      usage: "Brossez dans le sens du pelage, 5 minutes par jour pour de meilleurs résultats.",
      reviews: [
        { id: 1, author: "Sophie M.", city: "Bruxelles", rating: 5, comment: "La brosse est incroyable, mon chat ronronne pendant le brossage !" }
      ],
      faq: [
        { question: "Convient aux poils longs ?", answer: "Oui, idéale pour les poils longs et mi-longs." }
      ],
      relatedProductSlugs: ["gant-deshedding-petcare", "lint-roller-petcare"],
    },
    {
      slug: "lint-roller-petcare",
      name: "Lint Roller Anti-Poils PetCare",
      price: "24.99",
      originalPrice: "34.99",
      shortDescription: "Éliminez les poils de vos vêtements instantanément",
      description: "Le lint roller PetCare élimine instantanément les poils de vos vêtements, canapés et tissus. Réutilisable et écologique.",
      featured: false,
      isNew: false,
      isTrending: true,
      badge: null,
      imageUrl: "https://res.cloudinary.com/df8gsalta/image/upload/v1781010417/Screenshot_20260605-095714-221_m9esac.png",
      colors: ["#0000FF", "#000000"], // Bleu, Noir
      benefits: ["Élimine 100% des poils", "Réutilisable", "Écologique"],
      emotionalBenefits: ["Vêtements propres", "Prêt en 30 secondes", "Zéro déchet"],
      ingredients: null,
      usage: "Passez le rouleau sur le tissu en effectuant des va-et-vient.",
      reviews: [
        { id: 1, author: "Julie M.", city: "Lyon", rating: 5, comment: "Indispensable, je l'emporte partout !" }
      ],
      faq: [
        { question: "Lavable ?", answer: "Oui, rincez sous l'eau et laissez sécher." }
      ],
      relatedProductSlugs: ["gant-deshedding-petcare", "brosse-anti-poils-petcare"],
    },
  ]);

  console.log("✅ Products seeded successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
