
# Invoice Management API

Backend API pour l'application de gestion de facturation.

## Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB

## Installation

1. Naviguer vers le dossier backend :
```bash
cd backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
Copier `.env` et modifier les valeurs selon votre configuration.

4. Démarrer MongoDB localement ou configurer une connexion cloud.

5. Démarrer le serveur :
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
└── .env            # Variables d'environnement
```

## Variables d'environnement

- `PORT` - Port du serveur (défaut: 5000)
- `MONGODB_URI` - URI de connexion MongoDB
- `JWT_SECRET` - Clé secrète pour JWT
- `NODE_ENV` - Environnement (development/production)
