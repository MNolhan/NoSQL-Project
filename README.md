# 🍲 API Recettes — MySQL (Users) + MongoDB (Recipes) + Redis (Cache)

API REST développée avec **Node.js + Express**.
- **MySQL** : gestion des **utilisateurs** (register/login) + mot de passe hashé + JWT
- **MongoDB** : stockage des **recettes**
- **Redis** : amélioration des performances via **cache** (ex: `GET /recipes`) + invalidation lors des modifications

> Objectif : montrer une architecture “multi-base” simple et cohérente, avec perf (cache) et séparation des responsabilités.

---

## ✅ Fonctionnalités

- CRUD Utilisateur (MySQL)
- CRUD recettes (MongoDB)
- Cache Redis sur la lecture (ex: liste des recettes)
- Invalidation du cache lors des opérations **create / update / delete**
- Validation des inputs (ex: Zod)
- Réponses JSON + gestion d’erreurs
- Token JWT

---

## 🧱 Stack

- Node.js, Express
- MySQL (mysql2/promise)
- MongoDB (mongodb driver)
- Redis (ioredis ou redis)
- JWT, bcrypt
- Zod
- Dotenv

---

## 🚀 Lancer le projet

### 1) Prérequis
- Node.js 18+ (ou 20+)
- Docker + Docker Compose (recommandé)

### 2) Installation

⚠️ Le projet fonctionne sur la branche : `tmp-main`

➡️ Merci de cloner et se placer dessus :

```bash
git clone <URL_DU_REPO>
cd <NOM_DU_PROJET>
git checkout tmp-main
npm install
npm run dev
```

### 3) Variables d’environnement
Créer un fichier `.env` à la racine :

```env
# Server
PORT=3000

# MySQL
HOST="127.0.0.1"
USER="root"
PASSWORD="root"
DATABASE="appdb"
PORTBASE=3306

#MongoDB
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=nosql_project
MONGO_COLLECTION=recipes

#Redis
REDIS_URL=redis://127.0.0.1:6379

jwtKey="Votre Clé"
```

### 4) Démarrer les bases (Docker)

Lance :
```bash
docker compose up -d
```

### 5) Lancer l’API

```bash
npm run dev
```

API dispo sur :
- `http://localhost:3000`

---

## 🔐 Authentification

L’API utilise un token **JWT**.
Après login, tu récupères un `token` à mettre dans les routes protégées :

**Header**
```
Authorization: Bearer <token>
```

---

## 📚 Routes

## 👤 Users (MySQL)

### Inscription
- `POST /auth/register`

Body :
```json
{
  "name": "Nolhan",
  "prenom": "Marteau",
  "email": "nolhan@mail.com",
  "password": "Password123!"
}
```

Retour :
- `201` + user (sans mdp)

### Connexion
- `POST /auth/login`

Body :
```json
{
  "email": "nolhan@mail.com",
  "password": "Password123!"
}
```

Retour :
```json
{
  "token": "xxxxx",
}
```
---

## 🍲 Recipes (MongoDB) — protégé par JWT

### Lister les recettes (avec cache Redis)
- `GET /recipes`

Comportement perf :
- Si cache présent → réponse rapide depuis Redis
- Sinon → MongoDB puis mise en cache (TTL configurable)

### Créer une recette (invalidation cache)
- `POST /recipes`

Body :
```json
{
  "title": "Poulet au curry",
  "ingredients": ["poulet", "curry", "oignon", "riz"],
  "steps": ["Émincer", "Cuire", "Mélanger"],
  "duration": 35
}
```

### Modifier une recette (invalidation cache)
- `PUT /recipes/:id`

Body (exemple) :
```json
{
  "title": "Poulet au curry (light)",
  "duration": 30
}
```

### Supprimer une recette (invalidation cache)
- `DELETE /recipes/:id`

---

## ⚡ Cache Redis (principe)

Cache typique :
- clé : `recipes:all`
- TTL : `CACHE_TTL_SECONDS`
- invalidation automatique lors de :
  - `POST /recipes`
  - `PUT /recipes/:id`
  - `DELETE /recipes/:id`

But : éviter que Postman te montre des données “pas à jour” après un update/delete.

---

## 🧪 Conseils de test (Postman)

1. `POST /auth/register`
2. `POST /auth/login` → récupérer le token
3. Dans Postman, mettre :
   - Authorization → Bearer Token → coller le token
4. Tester `GET /recipes`, puis `POST/PUT/DELETE` et re-`GET` (tu verras la différence avec le cache)

---

## 📝 Notes

- Ne pas commit le `.env`
- Le projet met en avant la logique : **Users relationnel** + **Données recette document** + **Cache perf**

---

## 👨‍💻 Auteur

Nolhan et Martin
