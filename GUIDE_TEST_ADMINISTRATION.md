# Guide de Test - Système d'Administration et Gestion des Rôles

## 📋 Vue d'ensemble

Ce système permet aux clients (utilisateurs qui ont créé un compte) de créer des utilisateurs avec différents rôles et de gérer leurs accès.

## 🎯 Rôles disponibles

1. **client** : L'utilisateur principal qui a créé le compte
2. **manager** : Peut gérer et envoyer les billets
3. **chef_protocole** : Peut voir les invités et réunions
4. **protocole** : Peut scanner uniquement les billets

## 🧪 Étapes de test

### 1. Test de création d'un utilisateur staff

#### Prérequis
- Avoir un compte client créé et connecté

#### Étapes
1. Connectez-vous avec un compte client
2. Accédez à la page **Administration** (lien dans le menu de navigation)
3. Cliquez sur **"+ Créer un utilisateur"**
4. Remplissez le formulaire :
   - Nom : `Dupont`
   - Prénom : `Jean`
   - Email : `jean.dupont@example.com` (doit être unique)
   - Téléphone : `0123456789`
   - Rôle : Sélectionnez un rôle (manager, chef_protocole, ou protocole)
5. Cliquez sur **"Créer l'utilisateur"**

#### Résultat attendu
- Un modal s'affiche avec les informations de l'utilisateur créé
- Un **mot de passe généré automatiquement** est affiché (8 caractères alphanumériques)
- ⚠️ **IMPORTANT** : Notez ce mot de passe, il ne sera plus affiché après fermeture du modal
- L'utilisateur apparaît dans le tableau des utilisateurs créés

### 2. Test de connexion avec un utilisateur staff

#### Étapes
1. Déconnectez-vous du compte client
2. Allez sur la page de connexion
3. Connectez-vous avec :
   - Email : L'email de l'utilisateur staff créé (ex: `jean.dupont@example.com`)
   - Mot de passe : Le mot de passe généré lors de la création
4. Cliquez sur **"Se connecter"**

#### Résultat attendu
- Connexion réussie
- Redirection vers le dashboard
- Le menu de navigation affiche uniquement les pages accessibles selon le rôle

### 3. Test des permissions selon les rôles

#### Test pour le rôle "manager"
1. Créez un utilisateur avec le rôle **manager**
2. Connectez-vous avec cet utilisateur
3. Vérifiez l'accès aux pages :
   - ✅ Dashboard : Accessible
   - ✅ Ajouter un invité : Accessible
   - ✅ Recherche invité : Accessible
   - ❌ Réunions : Non accessible (pas dans le menu)
   - ❌ Administration : Non accessible (réservé aux clients)

#### Test pour le rôle "chef_protocole"
1. Créez un utilisateur avec le rôle **chef_protocole**
2. Connectez-vous avec cet utilisateur
3. Vérifiez l'accès aux pages :
   - ✅ Dashboard : Accessible
   - ✅ Réunions : Accessible
   - ✅ Recherche invité : Accessible
   - ❌ Ajouter un invité : Non accessible
   - ❌ Administration : Non accessible

#### Test pour le rôle "protocole"
1. Créez un utilisateur avec le rôle **protocole**
2. Connectez-vous avec cet utilisateur
3. Vérifiez l'accès aux pages :
   - ✅ Dashboard : Accessible
   - ✅ Recherche invité : Accessible (pour scanner les billets)
   - ❌ Réunions : Non accessible
   - ❌ Ajouter un invité : Non accessible
   - ❌ Administration : Non accessible

### 4. Test d'accès aux données du client

#### Étapes
1. Connectez-vous avec le compte **client**
2. Créez quelques invités et réunions
3. Déconnectez-vous
4. Connectez-vous avec un utilisateur **manager** créé par ce client
5. Vérifiez que vous pouvez voir :
   - Les invités créés par le client
   - Les réunions créées par le client (si chef_protocole)

#### Résultat attendu
- Les utilisateurs staff voient les données du client qui les a créés
- Ils ne voient pas les données d'autres clients

### 5. Test de création d'invité par un manager

#### Étapes
1. Connectez-vous avec un utilisateur **manager**
2. Allez sur la page **"Ajouter un invité"**
3. Remplissez le formulaire et créez un invité

#### Résultat attendu
- L'invité est créé avec succès
- L'invité est associé au client parent (pas au manager)
- Le client peut voir cet invité dans sa liste

### 6. Test de scan de billet par un protocole

#### Étapes
1. Connectez-vous avec un utilisateur **protocole**
2. Allez sur la page **"Recherche invité"**
3. Scannez ou recherchez un invité par son ID

#### Résultat attendu
- Le protocole peut scanner et marquer la présence d'un invité
- Il ne peut pas voir la liste complète des invités

## 🔍 Points de vérification

### Backend
- ✅ Route `/api/staff-user` (POST) : Création d'utilisateur staff
- ✅ Route `/api/staff-users` (GET) : Liste des utilisateurs créés
- ✅ Vérification des permissions dans les contrôleurs
- ✅ Les utilisateurs staff accèdent aux données du client parent

### Frontend
- ✅ Page Administration accessible uniquement aux clients
- ✅ Menu de navigation filtré selon le rôle
- ✅ Affichage du mot de passe généré dans un modal
- ✅ Redirection après connexion selon le rôle

## 🐛 Problèmes potentiels et solutions

### Problème : "Email déjà utilisé"
**Solution** : Utilisez un email différent pour chaque utilisateur staff

### Problème : "Accès refusé" lors de la création d'utilisateur
**Solution** : Vérifiez que vous êtes connecté avec un compte **client**

### Problème : Mot de passe oublié pour un utilisateur staff
**Solution** : Le client doit créer un nouvel utilisateur ou utiliser la fonctionnalité "Mot de passe oublié" (si implémentée)

### Problème : Un utilisateur staff ne voit pas les données
**Solution** : Vérifiez que l'utilisateur a bien un `createdBy` pointant vers le client

## 📝 Notes importantes

1. **Sécurité des mots de passe** : Les mots de passe sont générés aléatoirement et hashés avec bcrypt avant stockage
2. **Isolation des données** : Chaque utilisateur staff ne voit que les données du client qui l'a créé
3. **Permissions granulaires** : Chaque rôle a des permissions spécifiques définies dans le code

## 🎉 Test réussi

Si tous les tests passent, le système d'administration et de gestion des rôles fonctionne correctement !

