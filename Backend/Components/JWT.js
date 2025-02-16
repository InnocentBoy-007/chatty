import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

class JsonWebToken {
    constructor() {
        dotenv.config();
        this.jwtSecretKey = process.env.jwtSecretKey;
    }

    async generateToken(payload) {
        return jwt.sign(payload, this.jwtSecretKey, { expiresIn: '1h' });
    }

    async compareToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ messag: "Access denied! Token is invalid!" });
        try {
            const isValidToken = jwt.verify(token, this.jwtSecretKey);
            if (!isValidToken) return res.status(401).json({ message: "Incorrect token!" });

            req.accountId = isValidToken.accountId;

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An unexpected error occured while trying to verify the token!" });
        }
    }
}

const Token = new JsonWebToken();
export default Token;
