"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (req.path === '/api/webhook') {
        return next();
    }
    if (!authHeader) {
        return res.status(403).json({ message: 'Token is missing' });
    }
    try {
        const verified = jsonwebtoken_1.default.verify(authHeader, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.verifyToken = verifyToken;
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'You are not authorized' });
    }
    next();
};
exports.isAdmin = isAdmin;
