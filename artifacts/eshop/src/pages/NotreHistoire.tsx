export default function NotreHistoire() {
  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-8 section-padding">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-4">Notre Histoire</h1>
        <p className="text-gray-500 text-center mb-12">Une marque née de l'amour des animaux de compagnie</p>

        <div className="space-y-10">
          <div className="bg-white rounded-xl p-8 border border-[#E8DFC8]">
            <h2 className="font-serif text-2xl font-bold text-[#4A7C59] mb-4">L'idée PetCare</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PetCare est née d'une frustration simple : en tant que propriétaires d'animaux, nous cherchions des produits de soin vraiment doux, sans compromettre l'efficacité. Les produits disponibles sur le marché étaient soit trop agressifs, soit peu efficaces.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Nous avons donc décidé de créer notre propre gamme — hypoallergénique, testée vétérinaire, et formulée avec les ingrédients les plus doux. La marque PetCare est le résultat de mois de recherche et de développement, en collaboration avec des vétérinaires et des dermatologues animaliers.
            </p>
          </div>

          <div className="bg-[#F5EDD7] rounded-xl p-8">
            <h2 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-4">Nos valeurs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "🌿", title: "Naturel", text: "Des ingrédients sélectionnés pour leur douceur et leur efficacité" },
                { icon: "🔬", title: "Testé", text: "Tous nos produits sont testés et approuvés par des vétérinaires" },
                { icon: "♻️", title: "Responsable", text: "Des emballages éco-responsables et des formules biodégradables" },
                { icon: "❤️", title: "Passion", text: "Une équipe de propriétaires d'animaux passionnés" },
              ].map((v, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-[#E8DFC8]">
                  <div className="text-2xl mb-2">{v.icon}</div>
                  <div className="font-semibold text-[#2D2D2D] mb-1">{v.title}</div>
                  <div className="text-gray-600 text-sm">{v.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-[#E8DFC8] text-center">
            <div className="text-4xl font-bold text-[#4A7C59] font-serif mb-2">+2 000</div>
            <div className="text-gray-600">propriétaires nous font confiance en Europe</div>
            <div className="mt-6">
              <a href="/#produits" className="btn-primary inline-block no-underline">Découvrir nos produits</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
