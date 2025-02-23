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

    // optimized codes
    async compareToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        try {
            if (!token) {
                const error = new Error("Access denied! Token is invalid");
                error.statusCode = 401;
                throw error;
            };

            const isValidToken = jwt.verify(token, process.env.jwtSecretKey);
            if (!isValidToken) {
                const error = new Error("Incorrect token!")
                error.statusCode(401);
                throw error;
            };

            req.accountId = isValidToken.accountId;
            next();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(error.statusCode || 500).json({ message: error.message || "An unexpected error occured while trying to verify the token!" })
            }
        }
    }
}

const Token = new JsonWebToken();
export default Token;
