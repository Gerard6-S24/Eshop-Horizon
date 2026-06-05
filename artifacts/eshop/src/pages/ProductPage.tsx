import { useState } from "react";
import { Link, useParams } from "wouter";
import { ShoppingCart, Minus, Plus, ChevronDown, ChevronUp, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { useCart } from "../context/CartContext";
import { StarRating } from "../components/StarRating";

const PRODUCT_NAMES: Record<string, string> = {
  "lingettes-hypoallergeniques": "Lingettes Hypoallergéniques PetCare — La Douceur que Votre Animal Mérite",
  "brosse-anti-poils": "Brosse Anti-Poils Réutilisable PetCare — Fini les Poils Partout",
  "rouleau-ramasse-poils": "Rouleau Ramasse-Poils PetCare — La Solution Virale des Propriétaires",
  "pet-hair-removal-glove": "Pet Hair Removal Glove PetCare — Fini les Poils Incrustés en 1 Seul Passage",
};

const ORDER_BUMPS: Record<string, { text: string; price: string }> = {
  "lingettes-hypoallergeniques": { text: "Ajoutez la Brosse Anti-Poils avec 30% de réduction", price: "13,99€ au lieu de 19,99€" },
  "pet-hair-removal-glove": { text: "Complétez avec les Lingettes PetCare — Pack Hygiène Complet -15%", price: "16,99€ au lieu de 19,99€" },
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
    addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
          <Link href="/produits" className="hover:text-[#4A7C59] no-underline">Produits</Link>
          <span>/</span>
          <span className="text-[#2D2D2D]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Images gallery */}
          <div className="flex flex-col gap-3">
            <div className="w-full aspect-square bg-gradient-to-br from-[#F5EDD7] to-[#e8f0e6] rounded-xl flex items-center justify-center border border-[#E8DFC8]">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#7D9B76" strokeWidth="1" className="opacity-60">
                <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
                <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
                <path d="M4.42 11.247A13.15 13.15 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
              </svg>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-gradient-to-br from-[#F5EDD7] to-[#e8f0e6] rounded-lg border border-[#E8DFC8] cursor-pointer hover:border-[#7D9B76] transition-colors flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7D9B76" strokeWidth="1.5" className="opacity-50">
                    <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
                    <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
                    <path d="M4.42 11.247A13.15 13.15 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
                  </svg>
                </div>
              ))}
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
                : <p className="text-gray-500">Composants naturels sélectionnés. Voir l'emballage pour la liste complète.</p>
            )}
            {tab === "utilisation" && <p>{product.usage ?? "Suivez les instructions figurant sur l'emballage."}</p>}
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

        {/* Emotional benefits */}
        {(product.emotionalBenefits ?? []).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 border border-[#E8DFC8]">
              <h3 className="font-serif font-bold text-[#2D2D2D] mb-4">Pourquoi vous allez l'adorer</h3>
              <ul className="space-y-2">
                {(product.emotionalBenefits ?? []).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#C9A84C] mt-0.5">★</span>{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#E8DFC8]">
              <h3 className="font-serif font-bold text-[#2D2D2D] mb-4">Bénéfices pratiques</h3>
              <ul className="space-y-2">
                {(product.benefits ?? []).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#4A7C59] mt-0.5">✓</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

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

        {/* Order bump */}
        {bump && (
          <div className="bg-[#F5EDD7] border-2 border-[#C9A84C] rounded-xl p-5 mb-10 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-[#2D2D2D]">{bump.text}</p>
              <p className="text-[#4A7C59] font-bold">{bump.price}</p>
            </div>
            <button className="btn-primary whitespace-nowrap">Ajouter</button>
          </div>
        )}

        {/* Related products */}
        {(product.relatedProductSlugs ?? []).length > 0 && (
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-6">Les clients ont aussi acheté</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {(product.relatedProductSlugs ?? []).map(relSlug => (
                <Link key={relSlug} href={`/produits/${relSlug}`} className="no-underline">
                  <div className="product-card p-4 flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#F5EDD7] to-[#e8f0e6] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7D9B76" strokeWidth="1.5">
                        <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
                        <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
                        <path d="M4.42 11.247A13.15 13.15 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-[#2D2D2D] text-sm line-clamp-2">{PRODUCT_NAMES[relSlug] ?? relSlug}</div>
                      <div className="text-[#4A7C59] text-xs mt-1">Voir le produit →</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
