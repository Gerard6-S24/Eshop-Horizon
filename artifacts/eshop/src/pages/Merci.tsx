import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { CheckCircle, Package, Mail } from "lucide-react";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";

export default function Merci() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = parseInt(params.get("orderId") ?? "0", 10);

  const { data: order } = useGetOrder(orderId, {
    query: { enabled: !!orderId, queryKey: getGetOrderQueryKey(orderId) }
  });

  const formatPrice = (n: number) => n.toFixed(2).replace(".", ",") + "€";

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-site mx-auto px-4 md:px-8 py-16 text-center">
        <div className="w-20 h-20 bg-[#4A7C59] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-3">
          Merci {order?.firstName ? `${order.firstName} !` : "pour votre commande !"}
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
          Votre commande a été confirmée. Un email de confirmation vous sera envoyé dans quelques minutes.
        </p>

        {order && (
          <div className="bg-white rounded-xl p-6 border border-[#E8DFC8] max-w-md mx-auto mb-10 text-left">
            <h2 className="font-serif font-bold text-[#2D2D2D] mb-4">Récapitulatif de la commande #{order.id}</h2>
            <div className="space-y-2 mb-4">
              {(order.items ?? []).map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm text-gray-600">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8DFC8] pt-3 flex justify-between font-bold text-[#2D2D2D]">
              <span>Total payé</span>
              <span className="text-[#4A7C59]">{formatPrice(order.total)}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Mail size={14} />
              <span>Confirmation envoyée à {order.email}</span>
            </div>
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
