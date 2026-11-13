const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'WEDD API',
    version: '1.0.0',
    description: 'API de gestion des mariages, invités, billets et comptes.',
  },
  servers: [{ url: '/api', description: 'API WEDD' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/register': {
      post: {
        tags: ['Auth'],
        summary: 'Créer un compte client',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nom', 'prenom', 'email', 'telephone', 'password', 'confirmPassword'],
                properties: {
                  nom: { type: 'string' },
                  prenom: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  telephone: { type: 'string' },
                  password: { type: 'string' },
                  confirmPassword: { type: 'string' },
                  dateMariage: { type: 'string', format: 'date' },
                  lieuMariage: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Compte créé' }, 400: { description: 'Données invalides' } },
      },
    },
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Connexion',
        description: 'Retourne un access token de 15 minutes et un refresh token de 7 jours.',
        responses: {
          200: { description: 'Connexion réussie' },
          400: { description: 'Identifiants incorrects' },
          403: { description: 'Compte désactivé' },
        },
      },
    },
    '/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Renouveler l\'access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: { refreshToken: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Nouveau token' }, 401: { description: 'Refresh token invalide' } },
      },
    },
    '/account/delete': {
      post: {
        tags: ['Compte'],
        summary: 'Supprimer son propre compte',
        security: [{ bearerAuth: [] }],
        description: 'Demande le mot de passe. Pour un client, supprime aussi invités, réunions, plan de salle et staff.',
        responses: { 200: { description: 'Compte supprimé' }, 400: { description: 'Mot de passe incorrect' } },
      },
    },
    '/users': {
      get: {
        tags: ['Admin'],
        summary: 'Liste des comptes',
        security: [{ bearerAuth: [] }],
        description: 'Réservé à l\'administrateur. Inclut la dernière connexion et le statut actif.',
        responses: { 200: { description: 'Liste des utilisateurs' }, 401: { description: 'Non connecté' }, 403: { description: 'Rôle insuffisant' } },
      },
    },
    '/admin/overview': {
      get: {
        tags: ['Admin'],
        summary: 'Vue d\'ensemble par rôle',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Compteurs par rôle, invités, billets et présences' } },
      },
    },
    '/admin/users/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Fiche d\'un compte',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Compte, mariage, invités et staff' }, 404: { description: 'Introuvable' } },
      },
    },
    '/admin/users/{id}/status': {
      put: {
        tags: ['Admin'],
        summary: 'Activer ou désactiver un compte',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Statut mis à jour' }, 400: { description: 'Action refusée' } },
      },
    },
    '/admin/audit': {
      get: {
        tags: ['Admin'],
        summary: 'Journal des actions',
        security: [{ bearerAuth: [] }],
        parameters: [{
          name: 'action',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['login_success', 'login_failure', 'account_activated', 'account_deactivated', 'account_deleted', 'password_reset', 'password_changed', 'presence', 'billet_envoye'],
          },
        }],
        responses: { 200: { description: 'Dernières entrées du journal' } },
      },
    },
    '/invites': {
      get: {
        tags: ['Invités'],
        summary: 'Liste des invités du mariage',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Invités' } },
      },
    },
    '/invite': {
      post: {
        tags: ['Invités'],
        summary: 'Ajouter un invité',
        security: [{ bearerAuth: [] }],
        description: 'Interdit au rôle protocole.',
        responses: { 201: { description: 'Invité créé' }, 403: { description: 'Permission refusée' } },
      },
    },
    '/invites/{inviteId}/presence': {
      post: {
        tags: ['Invités'],
        summary: 'Enregistrer une présence',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'inviteId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Présence enregistrée' } },
      },
    },
  },
};

export { swaggerSpec };
