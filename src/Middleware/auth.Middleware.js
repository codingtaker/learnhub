// auth.js
exports.checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.session.user || !allowedRoles.includes(req.session.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
