import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { useCart } from "../context/CartContext";

export default function Products() {
  const { data: products } = useListProducts();
  const { addItem } = useCart();

  const formatPrice = (n: number) => n.toFixed(2).replace(".", ",") + "€";

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-site mx-auto px-4 md:px-8 section-padding">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-2">Tous nos produits</h1>
        <p className="text-gray-500 text-center mb-12">Hygiène naturelle et efficace pour votre animal de compagnie</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(products ?? []).map(p => (
            <div key={p.slug} className="product-card">
              <div className="relative">
                <div className="w-full h-52 bg-gradient-to-br from-[#F5EDD7] to-[#e8f0e6] flex items-center justify-center overflow-hidden">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#7D9B76" strokeWidth="1.5">
                      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
                      <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
                      <path d="M4.42 11.247A13.15 13.15 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
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
