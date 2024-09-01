// middleware.js

const API_KEY = 'connect123';

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['api-key'];
    if (apiKey && apiKey === API_KEY) {
        next(); // API key is correct, proceed to the next middleware or route handler
    } else {
        res.status(401).json({ success: false, code: 401, message: 'Unauthorized' });
    }
};

module.exports = { apiKeyMiddleware };