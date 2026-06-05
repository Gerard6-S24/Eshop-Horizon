export default function PolitiqueConfidentialite() {
  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <h1 className="font-serif text-3xl font-bold text-[#2D2D2D] mb-8">Politique de Confidentialité — RGPD</h1>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500">Conformément au Règlement Général sur la Protection des Données (RGPD) — Dernière mise à jour : Janvier 2026</p>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">1. Responsable du traitement</h2>
            <p>E-Shop Horizon (marque PetCare) est responsable du traitement de vos données personnelles.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Informations d'identité : prénom, nom</li>
              <li>Coordonnées : email, téléphone, adresse postale</li>
              <li>Données de commande : produits achetés, montants, historique</li>
              <li>Données de navigation : cookies, adresse IP (anonymisée)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Traiter et livrer vos commandes</li>
              <li>Vous envoyer des confirmations de commande</li>
              <li>Assurer le service après-vente</li>
              <li>Améliorer nos services (données anonymisées)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">4. Durée de conservation</h2>
            <p>Vos données de commande sont conservées pendant 5 ans à compter de la commande (obligation légale). Les données de contact sont conservées 3 ans après le dernier contact.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement ("droit à l'oubli")</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="mt-2">Pour exercer ces droits, contactez-nous via notre formulaire de contact.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">6. Cookies</h2>
            <p>Notre site utilise des cookies techniques nécessaires au fonctionnement du site (panier, session). Nous n'utilisons pas de cookies publicitaires tiers sans votre consentement.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">7. Partage des données</h2>
            <p>Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec nos prestataires logistiques pour l'exécution de vos commandes, dans le cadre d'accords de confidentialité stricts.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
