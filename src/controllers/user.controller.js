const bcrypt = require('bcrypt');
const User = require('../models/users.models');

// INSCRIPTION
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      throw new Error("Veuillez remplir tous les champs");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'utilisateur existe déjà. Veuillez choisir un autre courriel." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    await newUser.save();

    // Création de la session
    req.session.userId = newUser._id;
    req.session.userName = newUser.name;
    req.session.userRole = newUser.role;

    // Réponse ou redirection
    return res.status(201).json({
      message: "Utilisateur enregistré avec succès.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// CONNEXION
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("Veuillez remplir tous les champs");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    return res.status(200).json({
      message: "Connexion réussie.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// DÉCONNEXION
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur lors de la déconnexion." });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: "Déconnexion réussie." });
  });
};
