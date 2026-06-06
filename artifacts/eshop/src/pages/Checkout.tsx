import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, Lock, CreditCard, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { processPayment, generateOrderId } from "../services/geniusPay";

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

type Step = "info" | "payment" | "processing";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, total, subtotal, shipping, freeShipping, clearCart } = useCart();

  const [step, setStep] = useState<Step>("info");
  const [orderId] = useState(() => generateOrderId());
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", postalCode: "", country: "FR",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [payError, setPayError] = useState<string | null>(null);

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

  const handleInfoNext = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep("payment");
  };

  const handlePayment = async () => {
    setPayError(null);
    setStep("processing");

    try {
      const result = await processPayment({
        orderId,
        amount: total,
        currency: "EUR",
        description: `Commande PetCare Horizon ${orderId}`,
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
      });

      if (!result.success) {
        setPayError(result.error ?? "Paiement refusé. Veuillez réessayer.");
        setStep("payment");
        return;
      }

      const products = items.map(i => ({
        vid: String(i.productId),
        quantity: i.quantity,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentToken: result.paymentToken,
          customerEmail: form.email,
          ...form,
          products,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as any).error ?? `Erreur serveur ${res.status}`);
      }

      clearCart();
      navigate(`/merci?orderId=${orderId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inattendue";
      setPayError(msg);
      setStep("payment");
    }
  };

  useEffect(() => {
    if (step === "payment") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

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

  const OrderSummary = () => (
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
      <div className="mt-4 pt-3 border-t border-[#E8DFC8]">
        <p className="text-xs text-gray-400 text-center">Ref. commande : {orderId}</p>
      </div>
    </div>
  );

  if (step === "processing") {
    return (
      <div className="bg-[#FAFAF7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A7C59] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">Traitement en cours…</h2>
          <p className="text-gray-500 text-sm">Validation du paiement et envoi de la commande</p>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="bg-[#FAFAF7] min-h-screen">
        <div className="max-w-site mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => setStep("info")} className="text-[#4A7C59] text-sm hover:underline">← Modifier mes infos</button>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-[#2D2D2D]">Paiement</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-[#E8DFC8]">
                <div className="flex items-center gap-2 mb-4">
                  <Lock size={18} className="text-[#4A7C59]" />
                  <h2 className="font-serif font-bold text-lg text-[#2D2D2D]">Paiement sécurisé</h2>
                </div>

                <div className="bg-[#F5EDD7] rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 font-medium mb-1">Traité par GeniusPay</p>
                  <p className="text-xs text-gray-500">Vos données bancaires sont chiffrées et sécurisées. Nous ne stockons jamais vos informations de carte.</p>
                </div>

                {/* GeniusPay payment form placeholder — will be replaced by the SDK iframe */}
                <div
                  id="geniuspay-container"
                  className="border-2 border-dashed border-[#E8DFC8] rounded-lg p-6 text-center text-gray-400 text-sm mb-4 min-h-[120px] flex flex-col items-center justify-center gap-2"
                >
                  <CreditCard size={28} className="text-[#4A7C59] opacity-60" />
                  <p>Interface de paiement GeniusPay</p>
                  <p className="text-xs">(Le module de paiement apparaîtra ici une fois la clé API configurée)</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {["Visa", "Mastercard", "Apple Pay", "Google Pay", "PayPal"].map(p => (
                    <span key={p} className="bg-gray-50 px-3 py-1 rounded text-xs text-gray-600 font-medium border border-gray-200">{p}</span>
                  ))}
                </div>

                {payError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-center">
                    <p className="text-red-600 text-sm">{payError}</p>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18} />
                  Payer {formatPrice(total)} et confirmer
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">En confirmant, vous acceptez nos <a href="/cgv" className="underline">CGV</a></p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E8DFC8]">
                <h3 className="font-medium text-sm text-[#2D2D2D] mb-2">Livraison à</h3>
                <p className="text-sm text-gray-600">
                  {form.firstName} {form.lastName}<br />
                  {form.address}, {form.postalCode} {form.city}<br />
                  {COUNTRIES.find(c => c.code === form.country)?.name ?? form.country}
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-site mx-auto px-4 md:px-8 py-8">
        <h1 className="font-serif text-3xl font-bold text-[#2D2D2D] mb-8">Finaliser la commande</h1>

        <form onSubmit={handleInfoNext}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

              <div className="bg-white rounded-xl p-4 border border-[#E8DFC8] flex items-center gap-3">
                <Lock size={16} className="text-[#4A7C59] flex-shrink-0" />
                <p className="text-xs text-gray-500">Paiement sécurisé par GeniusPay — Visa, Mastercard, Apple Pay, Google Pay, PayPal</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary />
              <button
                type="submit"
                className="btn-primary w-full mt-4 py-4 text-base flex items-center justify-center gap-2"
              >
                Continuer vers le paiement
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
