const express = require("express");

const router = express.Router();
// const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload= require("./UploadImage.js"); // Importation du middleware multer pour l'upload d'images
const { default: Login} = require("../Controllers/UserControllers/Login.js");
const { default: Register } = require("../Controllers/UserControllers/Register.js");
const { default: Logout } = require("../Controllers/UserControllers/Logout.js");
const { default: UserConnect } = require("../Controllers/UserControllers/UserConnect.js");
const { default: EditProfil } = require("../Controllers/UserControllers/EditProfil.js");
const { default: EditPassword } = require("../Controllers/UserControllers/EditPassword.js");
const { default: AddReunion } = require("../Controllers/ReunionControllers/AddReunion.js");
const { default: AllReunion } = require("../Controllers/ReunionControllers/AllReunion.js");
const { default: EditReunion } = require("../Controllers/ReunionControllers/EditReunion.js");
const { default: DeleteReunion } = require("../Controllers/ReunionControllers/DeleteReunion.js");
const { default:  AddInvite } = require( './../Controllers/InviteControllers/AddInvite');
const { default:  AllInvite } = require( './../Controllers/InviteControllers/AllInvite');
const { default:  OneInvite } = require( './../Controllers/InviteControllers/OneInvite');
const { default:  EditInvite } = require( './../Controllers/InviteControllers/EditInvite');
const { default:  DeleteInvite } = require( './../Controllers/InviteControllers/DeleteInvite');
const { default:  Presence } = require('./../Controllers/InviteControllers/Presence');
const { default: UsersGet } = require("../Controllers/UserControllers/UsersGet.js");
const authenticate = require("./AuthMiddleware.js").default;

// router.use(cors({ origin: 'http://localhost:5173', credentials: true }));

router.use(express.json());

// Routes

router.post("/register", Register);
router.post("/login", Login);

// Route pour récupérer les informations de les utilisateurs 
router.get("/users", UsersGet)

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


// Route de déconnexion
router.post('/logout', Logout);


module.exports = router;