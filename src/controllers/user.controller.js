const bcrypt = require('bcrypt');
const User = require('../models/users.models');

// INSCRIPTION
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, wantsToTeach, expertise, bio, role } = req.body;
  try {
    if (!firstName || !lastName || !email || !password) {
      throw new Error("Veuillez remplir tous les champs obligatoires");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'utilisateur existe déjà. Veuillez choisir un autre courriel." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      wantsToTeach: wantsToTeach || false,
      expertise: expertise || '',
      bio: bio || '',
      role: role || 'student'
    });

    await newUser.save();

    req.session.userId = newUser._id;
    req.session.userName = `${newUser.firstName} ${newUser.lastName}`;
    req.session.userRole = newUser.role;
    req.session.user = newUser;

    return res.status(201).json({
      message: "Utilisateur enregistré avec succès.",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        wantsToTeach: newUser.wantsToTeach,
        expertise: newUser.expertise,
        bio: newUser.bio
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
    req.session.userName = `${user.firstName} ${user.lastName}`;
    req.session.userRole = user.role;
    req.session.user = user;

    return res.status(200).json({
      message: "Connexion réussie.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        wantsToTeach: user.wantsToTeach,
        expertise: user.expertise,
        bio: user.bio
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
