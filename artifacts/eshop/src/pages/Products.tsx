import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  shortDescription: string;
  imageUrl?: string;
  isNew: boolean;
  isTrending: boolean;
  badge?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const apiUrl = import.meta.env.VITE_API_URL ?? "https://eshop-horizon.onrender.com";

  useEffect(() => {
    fetch(`${apiUrl}/api/products`)
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const formatPrice = (n: number) => n.toFixed(2).replace(".", ",") + "€";

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-site mx-auto px-4 md:px-8 section-padding">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-2">Tous nos produits</h1>
        <p className="text-gray-500 text-center mb-12">Hygiène naturelle et efficace pour votre animal de compagnie</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.slug} className="product-card">
              <div className="relative">
                <div className="w-full h-52 bg-gradient-to-br from-[#F5EDD7] to-[#e8f0e6] flex items-center justify-center overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#7D9B76" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  )}
                </div>
                {p.isNew && <span className="absolute top-3 left-3 badge-new">NOUVEAU</span>}
                {p.isTrending && <span className="absolute top-3 right-3 badge-popular">Viral TikTok</span>}
              </div>
              <div className="p-4">
                <h3 className="font-serif font-semibold text-[#2D2D2D] text-sm mb-2 leading-snug line-clamp-2">{p.name}</h3>
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{p.shortDescription}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-[#4A7C59]">{formatPrice(p.price)}</span>
                  {p.originalPrice > p.price && (
                    <span className="text-sm text-gray-400 line-through">{formatPrice(p.originalPrice)}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addItem({ productId: p.id, slug: p.slug, name: p.name, price: p.price })}
                    className="btn-primary flex-1 text-xs py-2"
                  >
                    Ajouter
                  </button>
                  <Link href={`/produits/${p.slug}`} className="btn-secondary flex-1 text-xs py-2 text-center no-underline">
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
