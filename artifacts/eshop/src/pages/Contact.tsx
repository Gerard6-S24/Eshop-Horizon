import { useState } from "react";
import { Mail, Clock, MapPin } from "lucide-react";
import { useSubmitContact } from "@workspace/api-client-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const submit = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    await submit.mutateAsync({ data: form });
    setSent(true);
  };

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-site mx-auto px-4 md:px-8 section-padding">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-2">Nous contacter</h1>
        <p className="text-gray-500 text-center mb-12">Notre équipe vous répond sous 24 heures</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Info */}
          <div>
            <div className="space-y-6">
              {[
                { icon: <Mail size={20} className="text-[#4A7C59]" />, title: "Email", text: "support@eshop-horizon.com" },
                { icon: <Clock size={20} className="text-[#4A7C59]" />, title: "Horaires", text: "Lun–Ven, 9h–18h (CET)" },
                { icon: <MapPin size={20} className="text-[#4A7C59]" />, title: "Expédition", text: "Depuis l'Europe, livraison 5-7 jours" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5EDD7] rounded-full flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-[#2D2D2D]">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl p-6 border border-[#E8DFC8]">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✓</div>
                <h3 className="font-serif font-bold text-[#4A7C59] text-xl mb-2">Message envoyé !</h3>
                <p className="text-gray-600 text-sm">Nous vous répondrons dans les 24 heures.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border-2 border-[#E8DFC8] rounded-lg text-sm focus:outline-none focus:border-[#4A7C59]"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border-2 border-[#E8DFC8] rounded-lg text-sm focus:outline-none focus:border-[#4A7C59]"
                    placeholder="jean@exemple.fr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-[#E8DFC8] rounded-lg text-sm focus:outline-none focus:border-[#4A7C59] resize-none"
                    placeholder="Comment pouvons-nous vous aider ?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submit.isPending}
                  className="btn-primary w-full py-3 disabled:opacity-60"
                >
                  {submit.isPending ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
