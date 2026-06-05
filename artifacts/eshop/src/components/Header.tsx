import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Produits" },
  { href: "/notre-histoire", label: "Notre Histoire" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const [location] = useLocation();

  return (
    <>
      {/* Sticky delivery bar */}
      <div className="bg-[#4A7C59] text-white text-center py-2 px-4 text-sm font-medium sticky top-0 z-50">
        Livraison gratuite des 45€ &nbsp;|&nbsp; Expédie depuis l'Europe &nbsp;|&nbsp; Retour 14 jours
      </div>

      {/* Header */}
      <header className="bg-[#FAFAF7] border-b border-[#E8DFC8] sticky top-[2.25rem] z-40 shadow-sm">
        <div className="max-w-site px-4 md:px-8 mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-[#4A7C59] font-serif font-bold text-xl no-underline">
            <span className="w-8 h-8 bg-[#4A7C59] rounded-full flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
                <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
                <path d="M8 14v.5"/>
                <path d="M16 14v.5"/>
                <path d="M11.25 16.25h1.5L12 17z"/>
                <path d="M4.42 11.247A13.15 13.15 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
              </svg>
            </span>
            PetCare
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors no-underline ${location === link.href ? "text-[#4A7C59]" : "text-[#2D2D2D] hover:text-[#4A7C59]"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart + hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/panier" className="relative p-2 text-[#2D2D2D] hover:text-[#4A7C59] transition-colors no-underline">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4A7C59] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-[#2D2D2D]"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#FAFAF7] border-t border-[#E8DFC8] px-4 py-4 flex flex-col gap-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#2D2D2D] font-medium text-base py-1 no-underline hover:text-[#4A7C59]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
