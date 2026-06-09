import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ShoppingCart, Minus, Plus, ChevronDown, ChevronUp, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { useCart } from "../context/CartContext";
import { StarRating } from "../components/StarRating";

const PRODUCT_NAMES: Record<string, string> = {
  "gant-deshedding-petcare": "Gant de Déshedding PetCare — Fini les Poils Incrustés en 1 Seul Passage",
  "brosse-anti-poils-petcare": "Brosse Anti-Poils Réutilisable PetCare — Fini les Poils Partout",
  "lint-roller-petcare": "Lint Roller Anti-Poils PetCare — La Solution Virale des Propriétaires",
};

const ORDER_BUMPS: Record<string, { text: string; price: string }> = {
  "gant-deshedding-petcare": { text: "Ajoutez la Brosse Anti-Poils avec 30% de réduction", price: "13,99€ au lieu de 19,99€" },
};

type TabKey = "description" | "ingredients" | "utilisation" | "avis";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const { data: product, isLoading } = useGetProduct(slug, {
    query: { enabled: !!slug, queryKey: getGetProductQueryKey(slug) }
  });
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>("description");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  
  // État pour la couleur sélectionnée par le client
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Sécurisation de l'initialisation de la couleur avec useEffect (Évite les boucles de rendu détectées par ChatGPT)
  useEffect(() => {
    if (product?.colors?.length && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  const formatPrice = (n: number) => n.toFixed(2).replace(".", ",") + "€";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-[#4A7C59] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-site mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-[#2D2D2D] mb-4">Produit introuvable</h1>
        <Link href="/" className="btn-primary inline-block no-underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const displayName = PRODUCT_NAMES[slug] ?? product.name;
  const savings = product.originalPrice - product.price;

  const handleAddToCart = () => {
    // On passe aussi la couleur sélectionnée au panier d'achat
    const nameWithColor = selectedColor 
      ? `${product.name} (${getColorName(selectedColor)})` 
      : product.name;

    addItem({ 
      productId: product.id, 
      slug: product.slug, 
      name: nameWithColor, 
      price: product.price, 
      quantity: qty 
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Petite fonction pour afficher le nom lisible de la couleur
  function getColorName(hex: string) {
    switch(hex.toLowerCase()) {
      case "#0000ff": return "Bleu";
      case "#ffc0cb": return "Rose";
      case "#008000": return "Vert";
      case "#000000": return "Noir";
      default: return "Unique";
    }
  }

  const bump = ORDER_BUMPS[slug];

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "ingredients", label: "Ingrédients" },
    { key: "utilisation", label: "Utilisation" },
    { key: "avis", label: "Avis" },
  ];

  return (
    <div className="bg-[#FAFAF7]">
      <div className="max-w-site mx-auto px-4 md:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#4A7C59] no-underline">Accueil</Link>
          <span>/</span>
          <span className="text-[#2D2D2D]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Images gallery - Affiche maintenant la vraie image produit */}
          <div className="flex flex-col gap-3">
            <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center border border-[#E8DFC8] overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 text-sm">Pas d'image disponible</div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {product.isNew && <span className="badge-new">NOUVEAU</span>}
              {product.isTrending && <span className="badge-popular">Viral TikTok</span>}
              {savings > 0 && (
                <span className="bg-[#4A7C59] text-white text-xs px-2.5 py-1 rounded-full font-bold">
                  ÉCONOMISEZ {formatPrice(savings)}
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-4 leading-tight">{displayName}</h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-[#4A7C59]">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <ul className="mb-6 space-y-1.5">
              {(product.benefits ?? []).slice(0, 3).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[#4A7C59] font-bold mt-0.5">✓</span>{b}
                </li>
              ))}
            </ul>

            {/* SECTION DES COULEURS (COLOR SWATCHES) */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700 block mb-2">
                  Couleur : <span className="font-bold text-[#2D2D2D]">{getColorName(selectedColor)}</span>
                </span>
                <div className="flex items-center gap-3">
                  {product.colors.map((colorHex: string) => (
                    <button
                      key={colorHex}
                      onClick={() => setSelectedColor(colorHex)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === colorHex ? "border-[#4A7C59] scale-110 shadow-md" : "border-gray-300"}`}
                      style={{ backgroundColor: colorHex }}
                      title={getColorName(colorHex)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + CTA */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border-2 border-[#E8DFC8] rounded-lg overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2.5 text-[#4A7C59] hover:bg-[#F5EDD7] transition-colors"><Minus size={16} /></button>
                <span className="px-4 py-2.5 font-semibold text-[#2D2D2D] min-w-[2.5rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-3 py-2.5 text-[#4A7C59] hover:bg-[#F5EDD7] transition-colors"><Plus size={16} /></button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
                <ShoppingCart size={18} />
                {added ? "Ajouté !" : "Ajouter au panier"}
              </button>
            </div>

            <Link href="/checkout" className="btn-secondary w-full block text-center mb-4 no-underline">
              Acheter maintenant
            </Link>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-2">
              {[
                { icon: <Truck size={14} />, text: "Livraison 5-7j" },
                { icon: <RotateCcw size={14} />, text: "Retour 30j" },
                { icon: <ShieldCheck size={14} />, text: "Paiement sécurisé" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500 bg-[#F5EDD7] px-3 py-1.5 rounded-full">
                  <span className="text-[#4A7C59]">{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10">
          <div className="flex border-b border-[#E8DFC8] mb-6 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${tab === t.key ? "border-[#4A7C59] text-[#4A7C59]" : "border-transparent text-gray-500 hover:text-[#2D2D2D]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="max-w-2xl text-gray-700 leading-relaxed text-sm">
            {tab === "description" && <p>{product.description}</p>}
            {tab === "ingredients" && (
              product.ingredients
                ? <ul className="space-y-3">
                    {product.ingredients.split("\n").filter(Boolean).map((line, i) => {
                      const [label, ...rest] = line.split(" — ");
                      return (
                        <li key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 py-2 border-b border-[#F0E9D8] last:border-0">
                          <span className="font-semibold text-[#2D2D2D] whitespace-nowrap">{label.trim()}</span>
                          {rest.length > 0 && <span className="text-gray-500">{rest.join(" — ")}</span>}
                        </li>
                      );
                    })}
                  </ul>
                : <p className="text-gray-500">Composants naturels sélectionnés. Sans danger pour votre animal de compagnie.</p>
            )}
            {tab === "utilisation" && <p>{product.usage ?? "Suisez les instructions figurant sur l'emballage."}</p>}
            {tab === "avis" && (
              <div className="space-y-4">
                {(product.reviews ?? []).map(r => (
                  <div key={r.id} className="bg-white rounded-xl p-4 border border-[#E8DFC8]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-[#F5EDD7] rounded-full flex items-center justify-center font-bold text-[#4A7C59] text-sm">{r.author[0]}</div>
                      <div>
                        <div className="font-semibold text-[#2D2D2D] text-sm">{r.author} — {r.city}</div>
                        <StarRating rating={r.rating} />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        {(product.faq ?? []).length > 0 && (
          <div className="mb-10 max-w-2xl">
            <h3 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-5">Questions fréquentes</h3>
            <div className="divide-y divide-[#E8DFC8] border border-[#E8DFC8] rounded-xl overflow-hidden">
              {(product.faq ?? []).map((f, i) => (
                <div key={i} className="bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-[#2D2D2D] text-sm hover:bg-[#FAFAF7] transition-colors"
                  >
                    <span>{f.question}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-[#4A7C59] flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-[#E8DFC8]">{f.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
