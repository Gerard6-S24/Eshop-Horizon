export default function PolitiqueRetour() {
  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <h1 className="font-serif text-3xl font-bold text-[#2D2D2D] mb-8">Politique de Retour et Remboursement</h1>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <div className="bg-[#F5EDD7] rounded-xl p-5 border border-[#E8DFC8]">
            <p className="font-semibold text-[#4A7C59]">Garantie Satisfait ou Remboursé 30 jours</p>
            <p className="text-sm text-gray-600 mt-1">Si vous n'êtes pas entièrement satisfait, nous vous remboursons intégralement.</p>
          </div>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">Droit de rétractation légal (14 jours)</h2>
            <p>Conformément à la Directive européenne 2011/83/UE et à l'article L221-18 du Code de la consommation français, vous disposez d'un délai de 14 jours calendaires à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">Notre garantie étendue (30 jours)</h2>
            <p>Au-delà des 14 jours légaux, E-Shop Horizon vous offre une garantie satisfaction de 30 jours. Si vous n'êtes pas satisfait pour quelque raison que ce soit, contactez-nous et nous procéderons au remboursement.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">Comment effectuer un retour ?</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Contactez notre service client via le formulaire de contact ou par email.</li>
              <li>Indiquez votre numéro de commande et la raison du retour.</li>
              <li>Nous vous enverrons les instructions de retour par e-mail.</li>
              <li>Renvoyez le produit dans son emballage d'origine.</li>
              <li>Le remboursement sera effectué sous 5 à 10 jours ouvrés après réception du retour.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">Conditions de retour</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Les produits doivent être retournés dans leur état d'origine.</li>
              <li>Les produits ouverts ou utilisés peuvent être retournés dans le cadre de notre garantie satisfaction.</li>
              <li>Les frais de retour sont à la charge du client sauf en cas de produit défectueux.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">Remboursement</h2>
            <p>Le remboursement sera effectué par le même moyen de paiement que celui utilisé lors de la commande, sous 5 à 10 jours ouvrés après réception et vérification du retour.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
