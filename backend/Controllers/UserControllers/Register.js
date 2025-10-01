import bcrypt from 'bcryptjs';
import User from "../../Models/User.js";

const Register = async (req, res) => {
    const { nom, prenom, email, telephone, password, confirmPassword, dateMariage, lieuMariage, couleurSite, themeMariage } = req.body;
    try {
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Les mots de passe ne correspondent pas",
                type: "danger"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            nom,
            prenom,
            email,
            telephone,
            password: hashedPassword,
            dateMariage,
            lieuMariage,
            couleurSite,
            themeMariage
        });

        await user.save();
        res.status(201).json({
            message: "Utilisateur créé avec succès!",
            type: "success",
            user
        });
    } catch (err) {
        console.error("Erreur lors de l'enregistrement :", err);
        res.status(400).json({
            message: err.message,
            type: "danger"
        });
    }
}

export default Register;