import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#2D2D2D] text-white mt-20">
      <div className="max-w-site mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#4A7C59] rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
                  <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
                  <path d="M4.42 11.247A13.15 13.15 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
                </svg>
              </div>
              <span className="font-serif font-bold text-xl text-[#F5EDD7]">PetCare</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Des soins naturels et efficaces pour le bonheur et la santé de votre animal de compagnie.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-semibold text-[#F5EDD7] mb-3">Informations</h4>
            <ul className="flex flex-col gap-2">
              {[
                { href: "/cgv", label: "Conditions Générales de Vente" },
                { href: "/politique-retour", label: "Politique de retour" },
                { href: "/politique-confidentialite", label: "Politique de confidentialité" },
                { href: "/expedition", label: "Politique d'expédition" },
                { href: "/contact", label: "Contact" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 text-sm hover:text-white transition-colors no-underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h4 className="font-serif font-semibold text-[#F5EDD7] mb-3">Paiement sécurisé</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Visa", "Mastercard", "Apple Pay", "Google Pay", "PayPal"].map(p => (
                <span key={p} className="bg-white text-gray-700 px-3 py-1 rounded text-xs font-semibold">{p}</span>
              ))}
            </div>
            <p className="text-gray-500 text-xs">Vos données sont protégées par un chiffrement SSL 256 bits.</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© 2026 E-Shop Horizon — Marque PetCare. Tous droits réservés.</p>
          <p className="text-gray-500 text-xs">Conformité RGPD — Vos données personnelles sont protégées et ne sont pas vendues à des tiers.</p>
        </div>
      </div>
    </footer>
  );
}
