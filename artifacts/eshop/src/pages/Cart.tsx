import { Link, useLocation } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { trackInitiateCheckout } from "../services/metaPixel";

export default function Cart() {
  const [, navigate] = useLocation();
  const { items, updateQuantity, removeItem, subtotal, shipping, total, freeShipping, freeShippingThreshold } = useCart();

  const formatPrice = (n: number) => n.toFixed(2).replace(".", ",") + "€";
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - subtotal, 0);

  const handleCheckout = () => {
    trackInitiateCheckout({
      value: total,
      numItems: items.reduce((s, i) => s + i.quantity, 0),
    });
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-site mx-auto px-4 md:px-8 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-[#7D9B76] mb-4 opacity-50" />
        <h1 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-3">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">Découvrez nos produits PetCare et prenez soin de votre animal.</p>
        <Link href="/#produits" className="btn-primary inline-block no-underline">Voir les produits</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-site mx-auto px-4 md:px-8 py-8">
        <h1 className="font-serif text-3xl font-bold text-[#2D2D2D] mb-8">Mon panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping progress bar */}
            <div className="bg-white rounded-xl p-5 border border-[#E8DFC8]">
              {freeShipping ? (
                <p className="text-[#4A7C59] font-semibold text-sm">🎉 Vous bénéficiez de la livraison gratuite !</p>
              ) : (
                <p className="text-gray-600 text-sm mb-2">
                  Plus que <strong className="text-[#4A7C59]">{formatPrice(remaining)}</strong> pour la livraison gratuite
                </p>
              )}
              <div className="w-full bg-[#E8DFC8] rounded-full h-2 mt-2">
                <div className="bg-[#4A7C59] h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 border border-[#E8DFC8]">
                {/* Mobile-first: image + content stacked nicely */}
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#F5EDD7] to-[#e8f0e6] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7D9B76" strokeWidth="1.5">
                      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
                      <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
                      <path d="M4.42 11.247A13.15 13.15 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
                    </svg>
                  </div>

                  {/* Name + price + controls — tout dans la zone flexible */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#2D2D2D] text-sm leading-tight mb-1">{item.name}</h3>
                    <p className="text-[#4A7C59] font-bold text-base">
                      {(item.price * item.quantity).toFixed(2).replace(".", ",")}€
                    </p>
                    {/* Controls sous le nom — parfait mobile */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border-2 border-[#E8DFC8] rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-[#4A7C59] hover:bg-[#F5EDD7] transition-colors active:bg-[#F5EDD7]"
                          aria-label="Réduire la quantité"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-[#4A7C59] hover:bg-[#F5EDD7] transition-colors active:bg-[#F5EDD7]"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 active:bg-red-100"
                        aria-label="Supprimer l'article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Order bump */}
            <div className="bg-[#F5EDD7] border-2 border-[#C9A84C] rounded-xl p-5">
              <p className="font-semibold text-[#2D2D2D] mb-1">Complétez votre commande</p>
              <p className="text-gray-600 text-sm mb-3">Ajoutez la Brosse Anti-Poils PetCare et économisez 30% — seulement 13,99€</p>
              <button className="btn-primary text-sm py-2">Ajouter au panier</button>
            </div>
          </div>

          {/* Summary — sticky sur desktop, plein bas sur mobile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-[#E8DFC8] lg:sticky lg:top-24">
              <h2 className="font-serif font-bold text-xl text-[#2D2D2D] mb-4">Récapitulatif</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Livraison</span>
                  <span className={freeShipping ? "text-[#4A7C59] font-medium" : "font-medium"}>
                    {freeShipping ? "Gratuite" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="border-t border-[#E8DFC8] pt-3 flex justify-between font-bold text-[#2D2D2D]">
                  <span>Total</span>
                  <span className="text-xl text-[#4A7C59]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Bouton Checkout — grand, accessible sur mobile */}
              <button
                onClick={handleCheckout}
                className="btn-primary w-full block text-center py-4 text-base font-semibold mb-3"
              >
                Passer la commande
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>🔒</span>
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
