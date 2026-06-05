import { useState } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, Lock } from "lucide-react";
import { useCreateOrder } from "@workspace/api-client-react";
import { useCart } from "../context/CartContext";

const COUNTRIES = [
  { code: "FR", name: "France" },
  { code: "BE", name: "Belgique" },
  { code: "CH", name: "Suisse" },
  { code: "LU", name: "Luxembourg" },
  { code: "DE", name: "Allemagne" },
  { code: "ES", name: "Espagne" },
  { code: "IT", name: "Italie" },
  { code: "NL", name: "Pays-Bas" },
  { code: "PT", name: "Portugal" },
  { code: "TG", name: "Togo" },
  { code: "SN", name: "Sénégal" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "CM", name: "Cameroun" },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, total, subtotal, shipping, freeShipping, clearCart } = useCart();
  const createOrder = useCreateOrder();

  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", postalCode: "", country: "FR"
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const formatPrice = (n: number) => n.toFixed(2).replace(".", ",") + "€";

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) errs.firstName = "Prénom requis";
    if (!form.lastName.trim()) errs.lastName = "Nom requis";
    if (!form.email.includes("@")) errs.email = "Email invalide";
    if (!form.phone.trim()) errs.phone = "Téléphone requis";
    if (!form.address.trim()) errs.address = "Adresse requise";
    if (!form.city.trim()) errs.city = "Ville requise";
    if (!form.postalCode.trim()) errs.postalCode = "Code postal requis";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    try {
      const order = await createOrder.mutateAsync({
        data: {
          ...form,
          currency: "EUR",
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
        }
      });
      clearCart();
      navigate(`/merci?orderId=${order.id}`);
    } catch (err) {
      console.error("Order failed", err);
    }
  };

  const field = (key: keyof FormData, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-[#2D2D2D] mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-lg text-[#2D2D2D] text-sm focus:outline-none focus:border-[#4A7C59] transition-colors ${errors[key] ? "border-red-400" : "border-[#E8DFC8]"}`}
      />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="max-w-site mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-4">Votre panier est vide</h1>
        <a href="/#produits" className="btn-primary inline-block no-underline">Voir les produits</a>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-site mx-auto px-4 md:px-8 py-8">
        <h1 className="font-serif text-3xl font-bold text-[#2D2D2D] mb-8">Finaliser la commande</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-[#E8DFC8]">
                <h2 className="font-serif font-bold text-lg text-[#2D2D2D] mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field("firstName", "Prénom", "text", "Jean")}
                  {field("lastName", "Nom", "text", "Dupont")}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {field("email", "Email", "email", "jean@exemple.fr")}
                  {field("phone", "Téléphone", "tel", "+33 6 12 34 56 78")}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#E8DFC8]">
                <h2 className="font-serif font-bold text-lg text-[#2D2D2D] mb-4">Adresse de livraison</h2>
                <div className="space-y-4">
                  {field("address", "Adresse complète", "text", "12 rue de la Paix")}
                  <div className="grid grid-cols-2 gap-4">
                    {field("postalCode", "Code postal", "text", "75001")}
                    {field("city", "Ville", "text", "Paris")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1">Pays</label>
                    <select
                      value={form.country}
                      onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-[#E8DFC8] rounded-lg text-[#2D2D2D] text-sm focus:outline-none focus:border-[#4A7C59]"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#E8DFC8]">
                <h2 className="font-serif font-bold text-lg text-[#2D2D2D] mb-4">Paiement sécurisé</h2>
                <div className="bg-[#F5EDD7] rounded-lg p-4 text-center">
                  <Lock size={24} className="mx-auto text-[#4A7C59] mb-2" />
                  <p className="text-sm text-gray-600">Paiement traité de façon sécurisée par GeniusPay</p>
                  <div className="flex justify-center flex-wrap gap-2 mt-3">
                    {["Visa", "Mastercard", "Apple Pay", "Google Pay", "PayPal"].map(p => (
                      <span key={p} className="bg-white px-2 py-1 rounded text-xs text-gray-700 font-medium border border-gray-200">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 border border-[#E8DFC8] sticky top-24">
                <h2 className="font-serif font-bold text-lg text-[#2D2D2D] mb-4">Votre commande</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 flex-1 mr-2">{item.name} × {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E8DFC8] pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Livraison</span>
                    <span className={freeShipping ? "text-[#4A7C59]" : ""}>{freeShipping ? "Gratuite" : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2D2D2D] pt-2">
                    <span>Total</span>
                    <span className="text-xl text-[#4A7C59]">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createOrder.isPending}
                  className="btn-primary w-full mt-5 py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {createOrder.isPending ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Traitement...</span>
                  ) : (
                    <span className="flex items-center gap-2"><ShieldCheck size={18} />Confirmer ma commande</span>
                  )}
                </button>

                {createOrder.isError && (
                  <p className="text-red-500 text-xs mt-2 text-center">Une erreur s'est produite. Veuillez réessayer.</p>
                )}

                <p className="text-xs text-gray-400 text-center mt-3">En confirmant, vous acceptez nos CGV</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
