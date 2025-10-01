const express = require("express");
const router = express.Router();
// const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { addReunion, allReunion, addInvite, allInvite, oneInvite, editReunion, deleteReunion, editInvite, deleteInvite, editPassword, presence } = require("../Controllers/Controllers.js");
const upload= require("./UploadImage.js"); // Importation du middleware multer pour l'upload d'images
const {default: Login} = require("../Controllers/UserControllers/Login.js");
const { default: Register } = require("../Controllers/UserControllers/Register.js");
const { default: Logout } = require("../Controllers/UserControllers/Logout.js");
const { default: UserConnect } = require("../Controllers/UserControllers/UserConnect.js");
const { default: EditProfil } = require("../Controllers/UserControllers/EditProfil.js");

const authenticate = require("./AuthMiddleware.js").default;

// router.use(cors({ origin: 'http://localhost:5173', credentials: true }));

router.use(express.json());

// Routes

router.post("/register", Register);
router.post("/login", Login);

// Route pour récupérer les informations de l'utilisateur connecté
router.get("/profil", authenticate,UserConnect);
router.put("/profil", authenticate,EditProfil)
router.put("/profil-password", authenticate,editPassword )

// Routes pour les invitations
router.post("/invite", authenticate, upload.single('image'), addInvite);
router.get("/invites", authenticate,allInvite);
router.get("/invites/:inviteId", authenticate, oneInvite)
router.put("/edit-invite/:id", authenticate,upload.single('image'), editInvite);
router.delete('/delete-invite/:id', authenticate, deleteInvite);

// presence invité 

router.post('/invites/:inviteId/presence', authenticate, presence);

//  Routes pour les reunions
router.post("/reunion", authenticate , addReunion)
router.get("/reunions", authenticate, allReunion);
router.put("/edit-reunion/:reunionId", authenticate, editReunion);
router.delete('/delete-reunion/:reunionId', authenticate, deleteReunion);


// Route de déconnexion
router.post('/logout', Logout);



module.exports = router;