import { useEffect } from "react";
import { Link, useSearch } from "wouter";
import { CheckCircle, Mail } from "lucide-react";
import { trackPurchase } from "../services/metaPixel";
import { useCart } from "../context/CartContext";

export default function Merci() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = params.get("orderId") ?? "";
  const { total } = useCart();

  useEffect(() => {
    if (!orderId) return;
    trackPurchase({
      orderId,
      value: total > 0 ? total : 0,
      currency: "EUR",
    });
  }, [orderId]);

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-site mx-auto px-4 md:px-8 py-16 text-center">
        <div className="w-20 h-20 bg-[#4A7C59] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-white" />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-3">
          Merci pour votre commande !
        </h1>
        <p className="text-gray-600 text-lg mb-4 max-w-lg mx-auto">
          Votre commande a été confirmée et est en cours de traitement. Un email de confirmation vous sera envoyé dans quelques minutes.
        </p>

        {orderId && (
          <div className="bg-white rounded-xl p-5 border border-[#E8DFC8] max-w-sm mx-auto mb-8">
            <div className="flex items-center gap-2 justify-center text-sm text-gray-600 mb-1">
              <Mail size={15} className="text-[#4A7C59]" />
              <span>Référence de commande</span>
            </div>
            <p className="font-mono font-bold text-[#2D2D2D] text-lg">{orderId}</p>
            <p className="text-xs text-gray-400 mt-1">Conservez cette référence pour le suivi de votre colis</p>
          </div>
        )}

        {/* Upsell */}
        <div className="bg-[#F5EDD7] border-2 border-[#C9A84C] rounded-xl p-6 max-w-lg mx-auto mb-10">
          <p className="font-semibold text-[#2D2D2D] mb-1">Avant de partir — offre exclusive !</p>
          <p className="text-gray-600 text-sm mb-4">Ajoutez le Pack Famille PetCare avec 25% de réduction — uniquement disponible maintenant</p>
          <button className="btn-primary">Profiter de l'offre</button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-secondary inline-block no-underline">Retour à l'accueil</Link>
          <Link href="/#produits" className="btn-primary inline-block no-underline">Continuer mes achats</Link>
        </div>
      </div>
    </div>
  );
}
