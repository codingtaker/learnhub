// auth.js
exports.checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.session.user || !allowedRoles.includes(req.session.user.role)) {
      req.session.message = {
        type: "danger",
        message: "403 Access denied"
      };
      return res.redirect("/api/home");
    }
    next();
  };
};
