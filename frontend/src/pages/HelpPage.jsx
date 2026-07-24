import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiArrowLeft, FiHelpCircle } from 'react-icons/fi';
import logo from '../assets/img/logo.png';

const FAQ_SECTIONS = [
  {
    title: 'Démarrage',
    items: [
      {
        q: 'Qu’est-ce que WEDD ?',
        a: 'WEDD est une plateforme de gestion de mariage : invités, tables, disposition de salle, réunions de protocole, billets et suivi des présences.',
      },
      {
        q: 'Comment créer un compte ?',
        a: 'Depuis la page d’accueil, cliquez sur Inscription. Remplissez vos informations personnelles et les détails du mariage. Votre compte est créé avec le rôle Client.',
      },
      {
        q: 'Comment me connecter ?',
        a: 'Allez sur Connexion, saisissez votre email et mot de passe. Selon votre rôle, vous êtes redirigé vers le dashboard ou l’espace administrateur.',
      },
      {
        q: 'J’ai oublié mon mot de passe',
        a: 'Sur la page de connexion, utilisez « Mot de passe oublié ». Un email vous permettra de réinitialiser votre accès.',
      },
    ],
  },
  {
    title: 'Rôles et permissions',
    items: [
      {
        q: 'Quels sont les rôles disponibles ?',
        a: 'Admin (gestion globale des comptes), Client (organisateur du mariage), Manager (gestion des invités et billets), Chef protocole (réunions et suivi), Protocole (recherche et scan des présences).',
      },
      {
        q: 'Qui peut créer un Manager, Chef protocole ou Protocole ?',
        a: 'Uniquement le Client, via la page Administration. Chaque membre du staff est rattaché au client qui l’a créé.',
      },
      {
        q: 'Que peut faire un Manager ?',
        a: 'Ajouter / modifier / supprimer des invités, envoyer les billets, disposer la salle. Il ne peut pas gérer le staff.',
      },
      {
        q: 'Que peuvent faire Chef protocole et Protocole ?',
        a: 'Ils consultent les invités et la salle. Le Chef protocole accède aussi aux réunions. Le Protocole se concentre sur la recherche et la validation de présence.',
      },
      {
        q: 'Que fait l’Admin ?',
        a: 'Il gère tous les utilisateurs de l’application (clients, staff, admins), peut modifier ou supprimer des comptes, et voit à quel client chaque staff est rattaché.',
      },
    ],
  },
  {
    title: 'Invités',
    items: [
      {
        q: 'Comment ajouter un invité ?',
        a: 'Depuis le Dashboard ou « Ajouter un invité », renseignez les informations. Le statut est Absent par défaut. Vous pourrez le passer à Présent plus tard.',
      },
      {
        q: 'Que signifient Présent et Absent ?',
        a: 'Absent (A) : invité pas encore confirmé présent. Présent (P) : présence validée (souvent via scan / recherche invité).',
      },
      {
        q: 'Comment attribuer une table ?',
        a: 'Lors de la création ou de la modification d’un invité, indiquez le nom de la table (toujours en majuscules). Ce nom doit correspondre à une table de la salle.',
      },
      {
        q: 'Comment envoyer un billet ?',
        a: 'Dans le tableau des invités, ouvrez la ligne puis utilisez le téléchargement PDF ou l’envoi. Le Manager et le Client peuvent le faire.',
      },
      {
        q: 'Comment rechercher un invité ?',
        a: 'Utilisez « Recherche invité » avec le nom, le téléphone ou l’identifiant. Utile pour le protocole le jour J.',
      },
    ],
  },
  {
    title: 'Salle et tables',
    items: [
      {
        q: 'Comment voir la disposition de la salle ?',
        a: 'Cliquez sur « Voir la salle » (ou « Disposer la salle » pour éditer). Vous voyez le plan 3D des tables.',
      },
      {
        q: 'Comment agrandir ou réduire la salle ?',
        a: 'En haut à droite de la vue salle, utilisez les boutons − et + (Taille). « Défaut » remet la taille initiale (100 %).',
      },
      {
        q: 'Qui peut modifier la salle ?',
        a: 'Le Client et le Manager. Ils peuvent déplacer les tables, en ajouter, changer les couleurs et sauvegarder.',
      },
      {
        q: 'Pourquoi les noms de tables sont en majuscules ?',
        a: 'Pour uniformiser l’affichage et éviter les erreurs d’attribution entre invités et tables (ex. : B747, BUFFET 1).',
      },
    ],
  },
  {
    title: 'Réunions',
    items: [
      {
        q: 'À quoi servent les réunions ?',
        a: 'Planifier les rendez-vous avec le protocole (date, lieu, sujet). Elles apparaissent aussi dans les notifications du client.',
      },
      {
        q: 'Qui gère les réunions ?',
        a: 'Principalement le Client et le Chef protocole via la page Réunions.',
      },
    ],
  },
  {
    title: 'Administration (Client)',
    items: [
      {
        q: 'Comment créer mon équipe (staff) ?',
        a: 'Allez dans Administration, créez un utilisateur avec le rôle Manager, Chef protocole ou Protocole. Notez le mot de passe généré : il ne s’affiche qu’une fois.',
      },
      {
        q: 'Puis-je régénérer un mot de passe staff ?',
        a: 'Oui, depuis la liste des utilisateurs créés dans Administration (actions Afficher / Copier / régénération selon les options disponibles).',
      },
    ],
  },
  {
    title: 'Profil et sécurité',
    items: [
      {
        q: 'Comment modifier mon profil ?',
        a: 'Page Profil : changez nom, email, téléphone, infos mariage (pour les clients) et mot de passe.',
      },
      {
        q: 'Mes données sont-elles protégées ?',
        a: 'L’accès aux pages et API nécessite une connexion. Chaque staff ne voit que les données du client auquel il est rattaché.',
      },
    ],
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-blue-100 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors"
      >
        <span className="font-medium text-slate-800 text-sm sm:text-base">{question}</span>
        <FiChevronDown
          className={`shrink-0 text-blue-600 transition-transform ${open ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-blue-50 pt-3">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HelpPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-blue-100 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="WEDD" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-bold text-blue-700 leading-tight">WEDD</p>
              <p className="text-xs text-slate-500">Centre d’aide & FAQ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => (token ? navigate(-1) : navigate('/'))}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            <FiArrowLeft size={16} />
            Retour
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <section className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-4">
            <FiHelpCircle size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Comment fonctionne WEDD ?
          </h1>
          <p className="mt-2 text-slate-500 text-sm sm:text-base">
            Toutes les réponses pour utiliser le site : comptes, rôles, invités, salle et réunions.
          </p>
        </section>

        <div className="space-y-8">
          {FAQ_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-blue-700 mb-3">{section.title}</h2>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <FaqItem key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 p-5 rounded-xl bg-blue-600 text-white text-center">
          <p className="font-semibold">Besoin d’un accompagnement supplémentaire ?</p>
          <p className="text-sm text-blue-100 mt-1 mb-4">
            Connectez-vous à votre espace ou revenez à l’accueil.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {token ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-50"
              >
                Mon dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login-page"
                  className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-50"
                >
                  Se connecter
                </Link>
                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg border border-white/40 text-white font-semibold hover:bg-blue-500"
                >
                  Accueil
                </Link>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HelpPage;
