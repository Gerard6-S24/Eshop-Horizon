export default function Expedition() {
  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <h1 className="font-serif text-3xl font-bold text-[#2D2D2D] mb-8">Politique d'Expédition</h1>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: "📦", title: "Préparation", text: "Sous 24h ouvrées" },
              { icon: "🚚", title: "Livraison Europe", text: "5 à 7 jours ouvrés" },
              { icon: "🆓", title: "Livraison gratuite", text: "Dès 45€ d'achat" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-[#E8DFC8] text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-semibold text-[#2D2D2D] text-sm">{item.title}</div>
                <div className="text-gray-500 text-xs">{item.text}</div>
              </div>
            ))}
          </div>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">Zones de livraison</h2>
            <p>Nous livrons dans les pays suivants :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Europe :</strong> France, Belgique, Suisse, Luxembourg, Monaco, Allemagne, Espagne, Italie, Pays-Bas, Portugal</li>
              <li><strong>Afrique francophone :</strong> Togo, Sénégal, Côte d'Ivoire, Bénin, Mali, Burkina Faso, Niger, Guinée, Cameroun</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">Délais de livraison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[#E8DFC8] rounded-lg overflow-hidden">
                <thead className="bg-[#F5EDD7]">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-[#2D2D2D]">Destination</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#2D2D2D]">Délai estimé</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#2D2D2D]">Frais</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFC8]">
                  {[
                    { dest: "France métropolitaine", delay: "5-7 jours ouvrés", cost: "Gratuit dès 45€ / 4,99€" },
                    { dest: "Europe (autres pays)", delay: "5-7 jours ouvrés", cost: "Gratuit dès 45€ / 6,99€" },
                    { dest: "Afrique francophone", delay: "10-14 jours ouvrés", cost: "9,99€" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAF7]"}>
                      <td className="px-4 py-3">{row.dest}</td>
                      <td className="px-4 py-3">{row.delay}</td>
                      <td className="px-4 py-3 text-[#4A7C59] font-medium">{row.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">Suivi de commande</h2>
            <p>Un e-mail de confirmation avec numéro de suivi vous sera envoyé dès l'expédition de votre colis. Vous pourrez suivre votre commande en temps réel via le lien fourni.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D] mb-2">Emballage discret</h2>
            <p>Toutes nos commandes sont expédiées dans un emballage neutre et discret, sans mention de la marque ou du contenu à l'extérieur.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
