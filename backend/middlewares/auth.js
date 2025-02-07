const { verifyToken } = require('../service/auth');

async function LoginAuthenticator(req, res, next) {    
    try {
        const userToken = req.cookies?.idToken;
        
        if (!userToken) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const User = verifyToken(userToken);
        
        if (!User) {
            res.clearCookie('idToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                domain: '.onrender.com'
            });
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        req.user = User;
        next();
    } catch (error) {
        res.clearCookie('idToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: '.onrender.com'
        });
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}
module.exports = { LoginAuthenticator };
