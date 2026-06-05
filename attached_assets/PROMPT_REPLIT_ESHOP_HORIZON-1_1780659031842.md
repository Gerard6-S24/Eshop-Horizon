# 🚀 PROMPT REPLIT — E-SHOP HORIZON / PETCARE
## À coller directement dans Replit Agent

---

Tu es un développeur full-stack senior expert en e-commerce.

Construis-moi un site e-commerce complet, professionnel et optimisé pour la conversion. Voici toutes les instructions. Respecte-les exactement dans l'ordre.

---

## 🏗️ STACK TECHNIQUE

- Frontend : React.js
- Backend : Node.js + Express
- Base de données : MongoDB
- Paiement : GeniusPay (API custom)
- Hébergement : Déploiement Replit natif
- Plugin fournisseur : Connexion Spocket via API
- Emails : Nodemailer
- Tracking : Google Tag Manager (GTM)

---

## 🏪 INFORMATIONS DE LA BOUTIQUE

- Nom boutique : E-Shop Horizon
- Marque produit : PetCare
- Niche : Hygiène et propreté des animaux de compagnie
- Langue : Français
- Marchés cibles : Europe (€) + Afrique francophone (XOF)
- Mobile-first : PRIORITÉ ABSOLUE

---

## 🎨 DESIGN

**Palette de couleurs :**
- Couleur principale : Vert sauge (#7D9B76)
- Couleur secondaire : Beige chaud (#F5EDD7)
- Fond : Blanc crème (#FAFAF7)
- Texte : Anthracite doux (#2D2D2D)
- CTA boutons : Vert profond (#4A7C59)
- Accents : Or doux (#C9A84C)

**Typographie :**
- Titres : Playfair Display (Google Fonts)
- Corps : Inter (Google Fonts)
- Taille mobile minimum : 16px corps, 28px titres H1

**Style général :**
- Minimaliste premium
- Beaucoup d'espace blanc
- Zéro animation lourde
- Temps de chargement cible : moins de 2 secondes
- Score PageSpeed mobile cible : 90+

---

## 📱 PAGES À CRÉER

### PAGE 1 — Accueil (/)

Sections dans cet ordre exact :

**1. Barre de livraison (sticky top)**
"🚚 Livraison gratuite dès 45€ | Expédié depuis l'Europe | Retour 14 jours"

**2. Header/Navigation**
- Logo PetCare (texte stylisé si pas d'image)
- Menu : Accueil | Produits | Notre Histoire | Contact
- Icône panier avec compteur
- Responsive hamburger menu sur mobile

**3. Hero Section**
- H1 : "Votre animal mérite ce qu'il y a de mieux"
- H2 : "Des soins doux, naturels et efficaces — livrés chez vous en quelques jours"
- CTA principal : bouton "Découvrir PetCare" → scroll vers produits
- Badge social proof : "⭐ +2 000 propriétaires nous font confiance"
- Image placeholder lifestyle (animal propre + propriétaire souriant)

**4. Section Produits Vedettes**
Afficher les 4 produits en cards :
- Lingettes Hypoallergéniques PetCare
- Brosse Anti-Poils Réutilisable PetCare
- Rouleau Ramasse-Poils PetCare
- Pet Hair Removal Glove PetCare — badge "NOUVEAU" + badge "🔥 Viral TikTok"
Chaque card : image + nom + prix + bouton "Voir le produit"

**5. Section Bundles / Offres**
7 offres en grille :
- Offre Essentiel : 1x Lingettes
- Offre Duo : Lingettes + Brosse (-10%)
- Offre Pack Premium : Lingettes + Brosse + Rouleau (-15%) — badge "POPULAIRE"
- Offre Pack Famille : 2x Lingettes + 2x Brosses + 1x Rouleau (-20%)
- Offre Pack Hygiène : Lingettes + Gant Microfibre (-10%)
- Offre Pack Maison Propre : Gant Microfibre + Rouleau (-10%)
- Offre Pack Ultimate : Lingettes + Brosse + Gant + Rouleau (-25%) — badge "MEILLEURE VALEUR"
Afficher : prix barré + prix remisé + économie réalisée

**6. Section Pourquoi PetCare**
Tableau comparaison :
| | PetCare | Marques classiques |
|---|---|---|
| Hypoallergénique | ✅ | ❌ |
| Sans parfum agressif | ✅ | ❌ |
| Testé vétérinaire | ✅ | ❌ |
| Livraison Europe rapide | ✅ | ❌ |
| Satisfaction garantie | ✅ | ❌ |

**7. Section Avant / Après**
Deux colonnes visuelles :
- Avant : "Poils partout, animal inconfortable, routine longue"
- Après : "Maison propre, animal détendu, routine de 30 secondes"

**8. Section Avis Clients**
4 témoignages :
- Marie L., Lyon : "Mes chats adorent les lingettes PetCare. Aucune irritation depuis 3 mois !"
- Thomas R., Paris : "La brosse anti-poils est incroyable. Mon canapé est enfin propre."
- Sophie M., Bruxelles : "Livraison ultra rapide depuis l'Europe. Je recommande à 100%."
- Julie M., Lyon : "Le Pet Hair Removal Glove PetCare est incroyable — mon canapé n'a jamais été aussi propre depuis que j'ai mon golden retriever !"
Format : photo avatar générique + nom + ville + texte + 5 étoiles

**9. Section Garanties**
4 badges horizontaux :
- 🛡️ Satisfait ou Remboursé 30 jours
- 🚚 Livraison Europe 5-7 jours
- 🔒 Paiement 100% Sécurisé
- 🐾 Testé et approuvé par des vétérinaires

**10. FAQ Section**
5 questions :
- Vos produits sont-ils sans danger pour mon animal ?
- Quels sont les délais de livraison ?
- Comment fonctionne le remboursement ?
- Puis-je utiliser les lingettes sur un chaton ou chiot ?
- Comment contacter le service client ?

**11. CTA Final**
- Titre : "Rejoignez 2 000 propriétaires qui prennent soin de leur animal"
- Bouton : "Commander maintenant"

**12. Footer**
- Logo PetCare + slogan
- Liens : CGV | Politique de retour | Politique de confidentialité | Contact
- Badges paiement : Visa | Mastercard | Apple Pay | Google Pay | PayPal
- Mention RGPD
- © 2026 E-Shop Horizon — Marque PetCare

---

### PAGE 2 — Produit 1 (/produits/lingettes-hypoallergeniques)

Structure exacte :
1. Fil d'Ariane : Accueil > Produits > Lingettes
2. Galerie images produit (4 slots placeholder)
3. Titre : "Lingettes Hypoallergéniques PetCare — La Douceur que Votre Animal Mérite"
4. Prix : 19,99€ (barré 24,99€) + badge "ÉCONOMISEZ 5€"
5. Sélecteur quantité + bouton "Ajouter au panier" + "Acheter maintenant"
6. Badges sous le CTA : Livraison 5-7j | Retour 30j | Paiement sécurisé
7. Description courte : 3 bullet points bénéfices
8. Onglets : Description | Ingrédients | Utilisation | Avis
9. Bloc bénéfices émotionnels (5 points)
10. Bloc bénéfices santé animal (5 points)
11. Tableau comparaison PetCare VS concurrents
12. 3 avis clients avec étoiles
13. FAQ 5 questions spécifiques au produit
14. Order Bump : "Ajoutez la Brosse Anti-Poils avec 30% de réduction → +13,99€ au lieu de 19,99€"
15. Section "Les clients ont aussi acheté" → les 2 autres produits

---

### PAGE 3 — Produit 2 (/produits/brosse-anti-poils)

Même structure que Page 2.
Titre : "Brosse Anti-Poils Réutilisable PetCare — Fini les Poils Partout"
Prix : 19,99€

---

### PAGE 4 — Produit 3 (/produits/rouleau-ramasse-poils)

Même structure que Page 2.
Titre : "Rouleau Ramasse-Poils PetCare — La Solution Virale des Propriétaires"
Prix : 14,99€

---

### PAGE 5 — Produit 4 (/produits/pet-hair-removal-glove)

Même structure que Page 2 avec ces spécificités :

**Titre :** "Pet Hair Removal Glove PetCare — Fini les Poils Incrustés en 1 Seul Passage"
**Prix :** 16,99€ (barré 22,99€)
**Badges :** "NOUVEAU" + "RÉUTILISABLE — ZÉRO DÉCHET" + "🔥 Viral TikTok"

**Description courte (3 bullet points) :**
- ✅ Enlève 100% des poils incrustés en 1 seul passage — là où l'aspirateur échoue
- ✅ Fonctionne sur canapé, voiture, vêtements et moquette
- ✅ Réutilisable à l'infini — se lave en 10 secondes sous l'eau — zéro déchet

**Bénéfices émotionnels (5 points) :**
- "Fini la honte du canapé couvert de poils quand les amis arrivent"
- "2 minutes pour une maison propre — enfin une corvée qui ne prend pas d'énergie"
- "Un seul achat pour toute la vie — plus jamais de rouleaux adhésifs à racheter"
- "Votre animal peut enfin profiter du canapé sans que vous y pensiez à deux fois"
- "La satisfaction visuelle de voir tous les poils s'accumuler sur le gant en un passage"

**Bénéfices pratiques (5 points) :**
- Microfibre électrostatique haute densité — capture même les poils invisibles
- Compatible tous types de tissus : velours, lin, coton, microfibre
- Lavable en machine à 30° ou rinçage rapide sous l'eau
- Séchage rapide — prêt à réutiliser en 20 minutes
- Taille universelle — s'adapte à toutes les mains

**Tableau comparaison :**
| | Gant PetCare | Rouleau adhésif | Aspirateur |
|---|---|---|---|
| Poils incrustés dans tissu | ✅ | ❌ | ❌ |
| Réutilisable | ✅ | ❌ | ✅ |
| Voiture + canapé + vêtements | ✅ | ⚠️ Partiel | ❌ |
| Zéro déchet | ✅ | ❌ | ✅ |
| Prix long terme | ✅ Achat unique | ❌ Récurrent | ✅ |

**Avis clients spécifiques (3) :**
- Julie M., Lyon ★★★★★ : "Mon golden retriever laissait des poils partout dans le canapé. Un seul passage du Pet Hair Removal Glove et c'est propre. Incroyable."
- Marc D., Paris ★★★★★ : "J'utilisais des rouleaux adhésifs depuis 5 ans. Ce Pet Hair Removal Glove les remplace tous et ne coûte rien sur le long terme."
- Camille R., Bordeaux ★★★★★ : "Fonctionne aussi sur les sièges de voiture — enfin une solution qui marche vraiment."

**FAQ spécifique au produit (5 questions) :**
- Fonctionne-t-il sur tous les types de tissu ?
- Comment laver le gant après utilisation ?
- Fonctionne-t-il pour les poils courts de labrador ou berger ?
- Peut-on l'utiliser sur les vêtements et les rideaux ?
- Combien de temps dure le gant avant de s'user ?

**Order Bump :** "Complétez avec les Lingettes PetCare — Pack Hygiène Complet -15%"
**Section clients ont aussi acheté :** Rouleau ramasse-poils + Brosse anti-poils

---

### PAGE 6 — Panier (/panier)

- Liste des produits ajoutés avec quantité modifiable
- Sous-total + frais de livraison calculés automatiquement
- Livraison gratuite si panier > 45€ (barre de progression visuelle)
- Order Bump final avant checkout
- Bouton "Passer la commande" → vers checkout

---

### PAGE 7 — Checkout (/checkout)

Une seule page. Champs minimum :
- Prénom + Nom
- Email
- Téléphone
- Adresse complète
- Pays (liste déroulante)
- Section paiement GeniusPay (voir module paiement ci-dessous)
- Récapitulatif commande à droite (desktop) / en bas (mobile)
- Bouton "Confirmer ma commande"
- Badges sécurité visibles

---

### PAGE 8 — Confirmation commande (/merci)

- Message de remerciement personnalisé
- Récapitulatif de la commande
- One Click Upsell : "Avant de partir — ajoutez le Pack Famille avec 25% de réduction"
- Email de confirmation envoyé automatiquement

---

### PAGES LÉGALES

- /cgv — Conditions Générales de Vente
- /politique-retour — Politique de retour et remboursement (14 jours légaux Europe)
- /politique-confidentialite — RGPD complet
- /expedition — Politique d'expédition
- /contact — Formulaire de contact + email

---

## 💳 MODULE PAIEMENT — GENIUSPAY

### Détection géographique automatique

```javascript
// Détecter le pays du visiteur via API ipapi.co
const detectCountry = async () => {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  return data.country_code;
};

// Afficher devise selon pays
const getDisplayCurrency = (countryCode) => {
  const europeanCountries = ['FR', 'BE', 'CH', 'LU', 'MC', 'DE', 'ES', 'IT', 'NL', 'PT'];
  const africanCountries = ['TG', 'SN', 'CI', 'BJ', 'ML', 'BF', 'NE', 'GN', 'CM'];
  
  if (europeanCountries.includes(countryCode)) return 'EUR';
  if (africanCountries.includes(countryCode)) return 'XOF';
  return 'EUR'; // défaut Europe
};
```

### Intégration GeniusPay

```javascript
// Endpoint checkout GeniusPay
const initiatePayment = async (orderData, currency) => {
  const payload = {
    amount: orderData.total,
    currency: currency,
    gateway: currency === 'EUR' ? 'stripe' : 'mobile_money',
    order_id: orderData.id,
    customer_email: orderData.email,
    return_url: 'https://ton-site.replit.app/merci',
    cancel_url: 'https://ton-site.replit.app/panier',
    // Ajouter ici ta clé API GeniusPay
    api_key: process.env.GENIUSPAY_API_KEY
  };
  
  const response = await fetch('https://api.geniuspay.com/v1/checkout', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GENIUSPAY_API_KEY}`
    },
    body: JSON.stringify(payload)
  });
  
  return response.json();
};
```

### Variables d'environnement à configurer dans Replit Secrets :
- GENIUSPAY_API_KEY = [ta clé API GeniusPay]
- SPOCKET_API_KEY = [ta clé API Spocket]
- MONGODB_URI = [ton URI MongoDB Atlas gratuit]
- EMAIL_USER = [ton email]
- EMAIL_PASS = [mot de passe application]

---

## 📦 MODULE SPOCKET — AUTOMATISATION COMMANDES

```javascript
// Quand une commande est confirmée et payée
const fulfillOrderWithSpocket = async (order) => {
  const response = await fetch('https://api.spocket.co/api/v2/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SPOCKET_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      line_items: order.items,
      shipping_address: order.shipping_address,
      note: 'PetCare — Envoi neutre sans logo fournisseur'
    })
  });
  
  const spocketOrder = await response.json();
  
  // Sauvegarder le numéro de tracking
  await updateOrderTracking(order.id, spocketOrder.tracking_number);
  
  // Envoyer email tracking au client
  await sendTrackingEmail(order.customer_email, spocketOrder.tracking_number);
};
```

---

## 📧 MODULE EMAILS AUTOMATIQUES

Configurer avec Nodemailer :

**Email 1 — Confirmation commande (immédiat)**
- Objet : "✅ Votre commande PetCare est confirmée — Numéro [ORDER_ID]"
- Contenu : récapitulatif + délai livraison + contact support

**Email 2 — Expédition (quand tracking disponible)**
- Objet : "🚚 Votre colis PetCare est en route !"
- Contenu : numéro de suivi + lien tracking + délai estimé

**Email 3 — Suivi J+7**
- Objet : "Votre commande PetCare — Tout s'est bien passé ?"
- Contenu : satisfaction + invitation laisser avis + offre réachat -10%

---

## 🎯 MODULE TRACKING — PIXELS

Dans le <head> de chaque page, installer :

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- Remplacer GTM-XXXXXXX par ton ID GTM réel -->

<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'TON_PIXEL_META_ID');
fbq('track', 'PageView');
</script>

<!-- TikTok Pixel -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
  ttq.push=ttq.push||function(){(ttq.queue=ttq.queue||[]).push(arguments)};
  ttq.push(['init', 'TON_PIXEL_TIKTOK_ID']);
  ttq.push(['track', 'PageView']);
}(window, document, 'ttq');
</script>
```

Événements à tracker sur chaque action :
- Vue produit : `fbq('track', 'ViewContent')` + `ttq.push(['track', 'ViewContent'])`
- Ajout panier : `fbq('track', 'AddToCart')` + `ttq.push(['track', 'AddToCart'])`
- Début checkout : `fbq('track', 'InitiateCheckout')` + `ttq.push(['track', 'InitiateCheckout'])`
- Achat confirmé : `fbq('track', 'Purchase', {value: montant, currency: devise})` + même pour TikTok

---

## 🔔 MODULE POP-UP EMAIL

Déclencher après 9 secondes sur la page d'accueil uniquement.

Contenu :
- Titre : "🐾 Votre animal mérite mieux"
- Sous-titre : "Recevez gratuitement notre guide : Les 5 erreurs d'hygiène que font 90% des propriétaires"
- Champ email
- Bouton : "Je veux le guide gratuit"
- Lien fermeture : "Non merci, mon animal n'a pas besoin de soins particuliers"

Ne plus afficher si l'utilisateur a déjà saisi son email (cookie 30 jours).

---

## 🍪 BANNIÈRE COOKIES RGPD

Afficher au premier chargement :
"Ce site utilise des cookies pour améliorer votre expérience. En continuant, vous acceptez notre politique de confidentialité."
Boutons : "Accepter" | "Refuser" | "Personnaliser"

---

## ✅ CHECKLIST FINALE AVANT DÉPLOIEMENT

Vérifie que le site contient :
- [ ] Page d'accueil complète avec toutes les sections
- [ ] 4 pages produits avec structure complète (lingettes + brosse + rouleau + pet hair removal glove)
- [ ] 7 offres / bundles avec pricing progressif
- [ ] Checkout une page avec GeniusPay intégré
- [ ] Page confirmation avec upsell post-achat
- [ ] Détection géolocalisation → affichage EUR ou XOF automatique
- [ ] Connexion Spocket → fulfillment automatique des commandes
- [ ] Emails automatiques (confirmation + tracking + suivi J+7)
- [ ] Pop-up capture email après 9 secondes
- [ ] Pixels Meta + TikTok installés avec tous les événements
- [ ] Google Tag Manager installé
- [ ] Pages légales complètes (CGV + retour + confidentialité + expédition)
- [ ] Bannière cookies RGPD
- [ ] Badges de paiement dans footer et checkout
- [ ] Barre livraison gratuite avec progression
- [ ] Order Bump dans panier et checkout
- [ ] One Click Upsell sur page confirmation
- [ ] 100% responsive mobile
- [ ] Temps de chargement < 2 secondes

---

## 🚀 DÉPLOIEMENT

Une fois le site construit :
1. Configure les variables d'environnement dans Replit Secrets
2. Lance le serveur
3. Utilise le domaine Replit fourni pour tester
4. Connecte ton nom de domaine custom (eshophorizon.com) dans les paramètres Replit

---

*E-Shop Horizon — Marque PetCare — Prompt technique Replit — 2026*
