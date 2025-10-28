import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './assets/css/index.css'
import Connexion from './pages/Connexion.jsx'
import Inscription from './pages/Inscription.jsx'
import PageNotFound from './pages/PageNotFound.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Accueil from './pages/Accueil.jsx'
import Informations from './pages/Informations.jsx'
import AjoutInvite from './pages/AjoutInvite.jsx'
import MesReunions from './pages/MesReunions.jsx'
import RechercheInvite from './pages/RechercheInvite.jsx'
import ShowInvite from './pages/ShowInvite.jsx'
import Root from './components/Root.jsx'
import Salle from './components/Salle.jsx';
import AdminPage from './pages/AdminPage.jsx'

const router = createBrowserRouter (
  createRoutesFromElements (
      <>
      <Route element={<Root />}>
        <Route path="/" element={<Accueil />} />
        <Route path="/salle" element={<Salle />} />
        <Route path="/login-page" element={<Connexion />} />
        <Route path="/register-page" element={<Inscription />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profil" element={< Informations/>}/>
        <Route path="/ajout-invite" element={< AjoutInvite />}/>
        <Route path="/liste-reunions" element={< MesReunions />}/>
        <Route path="/recherche-invite" element={<RechercheInvite />} />
        <Route path="/invites/:inviteId" element={<ShowInvite />} /> 
        <Route path="/admin" element={<AdminPage />} /> 
        <Route path="*" element={<PageNotFound/>} />
      </Route>
      </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
