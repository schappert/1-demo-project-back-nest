🚀 Backend — API Sécurisée (NestJS + JWT HTTPOnly)

Backend développé avec NestJS, conçu pour être scalable, sécurisé, et prêt pour la production.
Cette API gère l’authentification, des données utilisateurs et le tableau de bord métier.

🛡️ Sécurité & Authentification Moderne

Ce backend adopte les dernières recommandations OWASP et les meilleures pratiques industrielles :

✔ JWT sécurisé via Cookies HTTPOnly (jamais exposés au frontend)
✔ Access Token court + Refresh Token rotatif
✔ Protection CSRF via SameSite=Strict
✔ Protection XSS : cookies non accessibles via JavaScript
✔ Refresh Tokens hachés + salés avant stockage en base
✔ Logout totalement sécurisé (révocation du Refresh Token)

<table> <tr><td>Type</td><td>Durée</td><td>Stockage</td><td>Sécurité</td></tr> <tr><td>Access Token</td><td>15 min</td><td>Cookie HTTPOnly</td><td>✅ Rotation auto</td></tr> <tr><td>Refresh Token</td><td>7 jours</td><td>Cookie HTTPOnly</td><td>✅ Haché en base</td></tr> </table>

🔐 Résultat : aucune donnée d’authentification n’est lisible depuis le navigateur.
Conforme aux pratiques Zero-Trust modernes.

🧩 Architecture Technique

Node.js 20+

NestJS (architecture modulaire)

TypeORM (PostgreSQL / MySQL adaptable)

Validation DTO + Pipes

Guards & Strategies JWT (Access + Refresh)

📌 Le système d’authentification inclut :

JwtStrategy

JwtRefreshStrategy

JwtAuthGuard

📊 Fonctionnalités
Catégorie	Fonction
Auth	Login, Refresh, Logout
Sécurité JWT	Rotation, Protection cookies, Vérifications multi-niveaux
Dashboard	Comptes utilisateurs + KPIs personnalisés
rôle backend	Architecture professionnelle modulaire
▶️ Installation & Démarrage
git clone https://github.com/<ton-user>/<ton-repo>.git
cd backend
npm install
npm run start:dev


Le serveur démarre sur :
➡️ http://localhost:3000

🔥 Exemple d’Endpoints
Méthode	Route	Sécurité	Description
POST	/auth/login	🔐 Cookies HTTPOnly	Connexion
POST	/auth/refresh	Refresh Token	Renouvellement session
GET	/dashboard	JWT Access	KPIs utilisateurs
📌 Dashboard Sécurisé

Chaque requête au Dashboard ✅ nécessite un Access Token valide.
En cas d’expiration ➜ un Refresh automatique transparent est déclenché.

➡️ Meilleure DX + robustesse en production

🎯 Objectif du projet

Ce backend est conçu comme une base solide professionnelle pour :

✅ Applications SaaS
✅ Plateformes sécurisées
✅ Applications Dashboard avec rôles & permissions

✅ Qualité & Maintainability

Code 100% TypeScript

Services et Controllers clairement séparés

Logs détaillés

Facilité de tests E2E
