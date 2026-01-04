import express from 'express';
const router = express.Router();
import upload from "./UploadImage.js"; // Import du middleware multer pour l'upload d'images
import Login from "../Controllers/UserControllers/Login.js";
import Register from "../Controllers/UserControllers/Register.js";
import Logout from "../Controllers/UserControllers/Logout.js";
import UserConnect from "../Controllers/UserControllers/UserConnect.js";
import EditProfil from "../Controllers/UserControllers/EditProfil.js";
import EditPassword from "../Controllers/UserControllers/EditPassword.js";

import AddReunion from "../Controllers/ReunionControllers/AddReunion.js";
import AllReunion from "../Controllers/ReunionControllers/AllReunion.js";
import EditReunion from "../Controllers/ReunionControllers/EditReunion.js";
import DeleteReunion from "../Controllers/ReunionControllers/DeleteReunion.js";

import AddInvite from '../Controllers/InviteControllers/AddInvite.js';
import AllInvite from '../Controllers/InviteControllers/AllInvite.js';
import OneInvite from '../Controllers/InviteControllers/OneInvite.js';
import EditInvite from '../Controllers/InviteControllers/EditInvite.js';
import DeleteInvite from '../Controllers/InviteControllers/DeleteInvite.js';
import Presence from '../Controllers/InviteControllers/Presence.js';

import UsersGet from "../Controllers/UserControllers/UsersGet.js";
import UsersDelete from "../Controllers/UserControllers/UsersDelete.js";
import UsersEdit from "../Controllers/UserControllers/UsersEdit.js";
import CreateStaffUser from "../Controllers/UserControllers/CreateStaffUser.js";
import GetStaffUsers from "../Controllers/UserControllers/GetStaffUsers.js";
import EditStaffUser from "../Controllers/UserControllers/EditStaffUser.js";
import DeleteStaffUser from "../Controllers/UserControllers/DeleteStaffUser.js";
import RegeneratePassword from "../Controllers/UserControllers/RegeneratePassword.js";

import GetRoomLayout from "../Controllers/RoomLayoutControllers/GetRoomLayout.js";
import SaveRoomLayout from "../Controllers/RoomLayoutControllers/SaveRoomLayout.js";

import authenticate from "./AuthMiddleware.js";
import { forgotPassword } from '../Controllers/UserControllers/ForgotPassword.js';

router.use(express.json());

// Routes

router.post("/register", Register);
router.post("/login", Login);

// Route pour récupérer les informations de les utilisateurs 
router.get("/users",UsersGet)
router.delete("/delete-user/:id", authenticate, UsersDelete);
router.put("/edit-user/:id", authenticate, UsersEdit);

// Routes pour la gestion des utilisateurs staff (créés par le client)
router.post("/staff-user", authenticate, CreateStaffUser);
router.get("/staff-users", authenticate, GetStaffUsers);
router.put("/staff-user/:userId", authenticate, EditStaffUser);
router.delete("/staff-user/:userId", authenticate, DeleteStaffUser);
router.post("/staff-user/:userId/regenerate-password", authenticate, RegeneratePassword);

// mot de passe oublié et réinitialisation
router.post("/forgot-password", forgotPassword);

// Route pour récupérer les informations de l'utilisateur connecté
router.get("/profil", authenticate,UserConnect);
router.put("/profil", authenticate,EditProfil)
router.put("/profil-password", authenticate,EditPassword )

// Routes pour les invitations
router.post("/invite", authenticate, upload.single('image'), AddInvite);
router.get("/invites", authenticate,AllInvite);
router.get("/invites/:inviteId", authenticate, OneInvite)
router.put("/edit-invite/:id", authenticate,upload.single('image'), EditInvite);
router.delete('/delete-invite/:id', authenticate, DeleteInvite);

// presence invité 

router.post('/invites/:inviteId/presence', authenticate, Presence);

//  Routes pour les reunions
router.post("/reunion", authenticate , AddReunion)
router.get("/reunions", authenticate, AllReunion);
router.put("/edit-reunion/:reunionId", authenticate, EditReunion);
router.delete('/delete-reunion/:reunionId', authenticate, DeleteReunion);

// Routes pour la disposition de la salle
router.get("/room-layout", authenticate, GetRoomLayout);
router.put("/room-layout", authenticate, SaveRoomLayout);

// Route de déconnexion
router.post('/logout', Logout);


export default router;