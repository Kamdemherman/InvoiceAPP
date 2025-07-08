
# Invoice Management API

Backend API pour l'application de gestion de facturation.

## Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB

## Déploiement sur Railway

### 1. Préparation

1. Créer un compte sur [Railway](https://railway.app)
2. Connecter votre repository GitHub

### 2. Déploiement

1. Sur Railway, cliquer sur "New Project"
2. Sélectionner "Deploy from GitHub repo"
3. Choisir votre repository
4. Railway détectera automatiquement votre backend Node.js

### 3. Configuration des variables d'environnement

Dans Railway, ajouter ces variables d'environnement :

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoice-app?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
```

### 4. Configuration MongoDB Atlas

1. Créer un cluster sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Créer un utilisateur de base de données
3. Whitelist l'IP 0.0.0.0/0 (pour Railway)
4. Copier la connection string dans MONGODB_URI

### 5. Domaine personnalisé (optionnel)

Railway génère automatiquement un domaine. Vous pouvez utiliser un domaine personnalisé dans les paramètres du projet.

## Installation locale

1. Naviguer vers le dossier backend :
```bash
cd backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
Copier `.env.example` vers `.env` et modifier les valeurs.

4. Démarrer le serveur :
```bash
# Mode développement avec nodemon
npm run dev

# Mode production
npm start
```

## API Endpoints

### Clients
- `GET /api/clients` - Récupérer tous les clients
- `GET /api/clients/:id` - Récupérer un client par ID
- `POST /api/clients` - Créer un nouveau client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Produits
- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/:id` - Récupérer un produit par ID
- `POST /api/products` - Créer un nouveau produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Factures
- `GET /api/invoices` - Récupérer toutes les factures
- `GET /api/invoices/:id` - Récupérer une facture par ID
- `POST /api/invoices` - Créer une nouvelle facture
- `PUT /api/invoices/:id` - Modifier une facture
- `DELETE /api/invoices/:id` - Supprimer une facture
- `PATCH /api/invoices/:id/status` - Modifier le statut d'une facture

### Paiements
- `GET /api/payments` - Récupérer tous les paiements
- `GET /api/payments/:id` - Récupérer un paiement par ID
- `POST /api/payments` - Enregistrer un nouveau paiement
- `PUT /api/payments/:id` - Modifier un paiement
- `DELETE /api/payments/:id` - Supprimer un paiement

## Structure du projet

```
backend/
├── models/          # Modèles Mongoose
├── routes/          # Routes API Express
├── server.js        # Point d'entrée du serveur
├── package.json     # Dépendances et scripts
├── railway.json     # Configuration Railway
├── Dockerfile       # Configuration Docker
└── .env.example     # Exemple de variables d'environnement
```

## Variables d'environnement

- `PORT` - Port du serveur (défaut: 5000)
- `MONGODB_URI` - URI de connexion MongoDB Atlas
- `NODE_ENV` - Environnement (development/production)

## Support

- [Documentation Railway](https://docs.railway.app/)
- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)