const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const authorize = (roles) => {
  return (req, res, next) => {
    let token =
      req?.cookies?.accessToken ||
      req.get("Authorization") ||
      req.headers["authorization"];

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Access token missing!" });

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (!roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied!" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
};

module.exports = authorize;
