import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CartContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Merci from "./pages/Merci";
import Contact from "./pages/Contact";
import NotreHistoire from "./pages/NotreHistoire";
import CGV from "./pages/legal/CGV";
import PolitiqueRetour from "./pages/legal/PolitiqueRetour";
import PolitiqueConfidentialite from "./pages/legal/PolitiqueConfidentialite";
import Expedition from "./pages/legal/Expedition";
import { trackPageView } from "./services/metaPixel";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-[#4A7C59] mb-3">404</h1>
        <p className="text-gray-600 mb-6">Cette page n'existe pas.</p>
        <a href="/" className="btn-primary inline-block no-underline">Retour à l'accueil</a>
      </div>
    </div>
  );
}

/** Refire PageView à chaque changement de route (SPA navigation). */
function PageViewTracker() {
  const [location] = useLocation();
  useEffect(() => {
    trackPageView();
  }, [location]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    }
  }
});

function Router() {
  return (
    <>
      <PageViewTracker />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/produits" component={Products} />
        <Route path="/produits/:slug" component={ProductPage} />
        <Route path="/panier" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/merci" component={Merci} />
        <Route path="/contact" component={Contact} />
        <Route path="/notre-histoire" component={NotreHistoire} />
        <Route path="/cgv" component={CGV} />
        <Route path="/politique-retour" component={PolitiqueRetour} />
        <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />
        <Route path="/expedition" component={Expedition} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {/* Correction de la base du routeur demandée pour Render */}
        <WouterRouter base="">
          <Header />
          <main>
            <Router />
          </main>
          <Footer />
        </WouterRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}
