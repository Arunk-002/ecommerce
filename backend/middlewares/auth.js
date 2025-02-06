const { verifyToken } = require('../service/auth');

async function LoginAuthenticator(req, res, next) {    
    const userToken = req.cookies?.idToken;
    if (!userToken) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const User = verifyToken(userToken);
    if (!User) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = User;
    next();
}

module.exports = { LoginAuthenticator };
