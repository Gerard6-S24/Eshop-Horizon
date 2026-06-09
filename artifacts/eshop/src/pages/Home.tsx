import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronUp, ShieldCheck, Truck, Lock, Award } from "lucide-react";
import { useListFeaturedProducts, useListBundles } from "@workspace/api-client-react";
import { useCart } from "../context/CartContext";
import { StarRating } from "../components/StarRating";

const testimonials = [
  { name: "Marie L.", city: "Lyon", text: "Mes chats adorent les lingettes PetCare. Aucune irritation depuis 3 mois !", rating: 5 },
  { name: "Thomas R.", city: "Paris", text: "La brosse anti-poils est incroyable. Mon canapé est enfin propre.", rating: 5 },
  { name: "Sophie M.", city: "Bruxelles", text: "Livraison ultra rapide depuis l'Europe. Je recommande à 100%.", rating: 5 },
  { name: "Julie M.", city: "Lyon", text: "Le Pet Hair Removal Glove PetCare est incroyable — mon canapé n'a jamais été aussi propre depuis que j'ai mon golden retriever !", rating: 5 },
];

const guarantees = [
  { icon: <ShieldCheck size={28} className="text-[#4A7C59]" />, title: "Satisfait ou Remboursé", subtitle: "30 jours" },
  { icon: <Truck size={28} className="text-[#4A7C59]" />, title: "Livraison Europe", subtitle: "5-7 jours" },
  { icon: <Lock size={28} className="text-[#4A7C59]" />, title: "Paiement 100% Sécurisé", subtitle: "SSL 256 bits" },
  { icon: <Award size={28} className="text-[#4A7C59]" />, title: "Testé par des vétérinaires", subtitle: "Approuvé" },
];

const faqs = [
  { q: "Vos produits sont-ils sans danger pour mon animal ?", a: "Oui, tous nos produits PetCare sont testés dermatologiquement et approuvés par des vétérinaires. Ils sont formulés sans alcool et sans parfum agressif." },
  { q: "Quels sont les délais de livraison ?", a: "Nous expédions depuis l'Europe sous 24h. La livraison est estimée entre 5 et 7 jours ouvrés selon votre pays." },
  { q: "Comment fonctionne le remboursement ?", a: "Si vous n'êtes pas satisfait, contactez-nous sous 30 jours. Nous vous remboursons intégralement, sans poser de questions." },
  { q: "Puis-je utiliser les lingettes sur un chaton ou chiot ?", a: "Absolument. Nos lingettes sont spécialement conçues pour être douces, même pour les animaux les plus jeunes et les peaux les plus sensibles." },
  { q: "Comment contacter le service client ?", a: "Utilisez notre formulaire de contact ou envoyez-nous un e-mail. Nous répondons sous 24 heures." },
];

export default function Home() {
  const { data: products } = useListFeaturedProducts();
  const { data: bundles } = useListBundles();
  const { addItem } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const formatPrice = (n: number) => n.toFixed(2).replace(".", ",") + "€";

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F5EDD7] via-[#FAFAF7] to-[#e8f0e6] py-16 md:py-24 px-4">
        <div className="max-w-site mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#C9A84C]/30 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-[#C9A84C] font-bold">★</span>
            <span className="text-sm font-medium text-[#2D2D2D]">+2 000 propriétaires nous font confiance</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#2D2D2D] mb-4 leading-tight">
            Votre animal mérite<br className="hidden md:block" /> ce qu'il y a de mieux
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Des soins doux, naturels et efficaces — livrés chez vous en quelques jours
          </p>
          <a
            href="#produits"
            className="btn-primary text-base md:text-lg px-8 py-4 inline-block"
          >
            Découvrir PetCare
          </a>
        </div>
      </section>

      {/* Featured Products */}
      <section id="produits" className="section-padding bg-[#FAFAF7]">
        <div className="max-w-site mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-2">Nos Produits Vedettes</h2>
          <p className="text-gray-500 text-center mb-10">Sélectionnés et approuvés par des milliers de propriétaires</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(products ?? []).map(p => (
              <div key={p.slug} className="product-card">
                <div className="relative">
                  {/* Div Image Cloudinary corrigée et injectée à la place de l'ancien SVG */}
                  <div className="w-full h-52 overflow-hidden bg-white rounded-t-xl flex items-center justify-center border-b border-[#E8DFC8]">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gradient-to-br from-[#F5EDD7] to-[#e8f0e6]">
                        Pas d'image disponible
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                    {p.isNew && <span className="badge-new">NOUVEAU</span>}
                    {p.isTrending && <span className="badge-popular">Viral TikTok</span>}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-semibold text-[#2D2D2D] text-sm mb-1 leading-tight line-clamp-2">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-[#4A7C59]">{formatPrice(p.price)}</span>
                    {p.originalPrice > p.price && (
                      <span className="text-sm text-gray-400 line-through">{formatPrice(p.originalPrice)}</span>
                    )}
                  </div>
                  <Link href={`/produits/${p.slug}`} className="btn-primary w-full text-sm py-2.5 block text-center no-underline">
                    Voir le produit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="section-padding bg-[#F5EDD7]">
        <div className="max-w-site mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-2">Offres & Bundles</h2>
          <p className="text-gray-600 text-center mb-10">Économisez jusqu'à 25% en combinant nos produits</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {(bundles ?? []).map(b => (
              <div key={b.id} className={`relative bg-white rounded-xl p-5 border-2 transition-all ${b.bestValue ? "border-[#C9A84C] shadow-lg" : b.popular ? "border-[#4A7C59] shadow-md" : "border-[#E8DFC8]"}`}>
                {(b.popular || b.bestValue) && (
                  <div className={`absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-bold text-white ${b.bestValue ? "bg-[#C9A84C]" : "bg-[#4A7C59]"}`}>
                    {b.bestValue ? "MEILLEURE VALEUR" : "POPULAIRE"}
                  </div>
                )}
                <h3 className="font-serif font-bold text-[#2D2D2D] mb-1">{b.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{b.description}</p>
                <ul className="text-xs text-gray-600 mb-4 space-y-1">
                  {(b.items ?? []).map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-[#4A7C59] font-bold mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-2xl font-bold text-[#4A7C59]">{formatPrice(b.price)}</span>
                  {b.originalPrice > b.price && (
                    <div className="pb-0.5">
                      <div className="text-xs text-gray-400 line-through">{formatPrice(b.originalPrice)}</div>
                      <div className="text-xs text-green-600 font-semibold">-{b.discountPercent}%</div>
                    </div>
                  )}
                </div>
                <button className="btn-primary w-full text-sm py-2.5">Ajouter au panier</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-padding bg-[#FAFAF7]">
        <div className="max-w-site mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-10">Pourquoi choisir PetCare ?</h2>
          <div className="overflow-x-auto rounded-xl border border-[#E8DFC8] shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#4A7C59] text-white">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Critère</th>
                  <th className="text-center px-6 py-4 font-semibold">PetCare</th>
                  <th className="text-center px-6 py-4 font-semibold">Marques classiques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8]">
                {[
                  "Hypoallergénique",
                  "Sans parfum agressif",
                  "Testé vétérinaire",
                  "Livraison Europe rapide",
                  "Satisfaction garantie",
                ].map((row, i) => (
                  <tr key={row} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAF7]"}>
                    <td className="px-6 py-4 font-medium text-[#2D2D2D]">{row}</td>
                    <td className="px-6 py-4 text-center text-xl">✅</td>
                    <td className="px-6 py-4 text-center text-xl">❌</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="section-padding bg-gradient-to-br from-[#F5EDD7] to-[#FAFAF7]">
        <div className="max-w-site mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-10">La différence PetCare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8 border-2 border-red-100">
              <div className="text-3xl mb-3">😔</div>
              <h3 className="font-serif text-xl font-bold text-gray-700 mb-3">Avant PetCare</h3>
              <ul className="space-y-2 text-gray-600">
                {["Poils partout sur le canapé et les vêtements", "Animal inconfortable après le nettoyage", "Produits irritants qui abîment la peau", "Routine longue et fastidieuse", "Résultats décevants"].map(t => (
                  <li key={t} className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border-2 border-[#7D9B76]">
              <div className="text-3xl mb-3">😊</div>
              <h3 className="font-serif text-xl font-bold text-[#4A7C59] mb-3">Après PetCare</h3>
              <ul className="space-y-2 text-gray-600">
                {["Maison propre en 30 secondes", "Animal détendu et confortable", "Produits doux et hypoallergéniques", "Routine rapide et agréable", "Résultats visibles dès le premier usage"].map(t => (
                  <li key={t} className="flex items-start gap-2"><span className="text-[#4A7C59] mt-0.5">✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-[#FAFAF7]">
        <div className="max-w-site mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-2">Ils nous font confiance</h2>
          <p className="text-gray-500 text-center mb-10">+2 000 propriétaires satisfaits en Europe</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-[#E8DFC8] shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5EDD7] flex items-center justify-center font-serif font-bold text-[#4A7C59]">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[#2D2D2D] text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.city}</div>
                  </div>
                </div>
                <StarRating rating={t.rating} />
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="section-padding bg-[#4A7C59]">
        <div className="max-w-site mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {guarantees.map((g, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">{g.icon}</div>
                <div className="text-white font-semibold text-sm">{g.title}</div>
                <div className="text-[#c8e6c0] text-xs">{g.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-[#FAFAF7]">
        <div className="max-w-site mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-10">Questions fréquentes</h2>
          <div className="divide-y divide-[#E8DFC8] border border-[#E8DFC8] rounded-xl overflow-hidden">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-[#2D2D2D] hover:bg-[#FAFAF7] transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-[#4A7C59] flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-[#E8DFC8]">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-[#F5EDD7] text-center">
        <div className="max-w-site mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4">
            Rejoignez 2 000 propriétaires qui prennent soin de leur animal
          </h2>
          <p className="text-gray-600 mb-8 text-lg">Livraison rapide depuis l'Europe · Satisfait ou remboursé 30 jours · Testé vétérinaire</p>
          <a href="#produits" className="btn-primary text-lg px-10 py-4 inline-block">
            Commander maintenant
          </a>
        </div>
      </section>
    </div>
  );
}
