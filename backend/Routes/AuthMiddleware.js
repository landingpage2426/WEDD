
import jwt from "jsonwebtoken";
import User from "../Models/User.js"; // Ajuste le chemin si besoin

const Authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Non autorisé : aucun token fourni" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password"); // ✅ on récupère tout sauf le mot de passe

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        req.user = user; // ✅ utilisateur complet dans la requête
        next();
    } catch (err) {
        console.error("Erreur de token :", err);
        return res.status(401).json({ message: "Token invalide" });
    }
};

export default Authenticate;
