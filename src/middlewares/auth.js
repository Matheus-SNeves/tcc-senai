// src/middlewares/auth.js
const jsonwebtoken = require("jsonwebtoken");

const validate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Nenhum token recebido." });
    }

    try {
        const payload = jsonwebtoken.verify(token, process.env.SECRET_JWT);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
};

const isAdmin = (req, res, next) => {
    const user = req.user;
    if (user && user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: "Acesso negado. Apenas administradores podem acessar esta rota." });
    }
};

const isCliente = (req, res, next) => {
    const user = req.user;
    if (user && user.role === 'CLIENTE') {
        next();
    } else {
        res.status(403).json({ message: "Acesso negado. Apenas clientes podem acessar esta rota." });
    }
};

module.exports = {
    validate,
    isAdmin,
    isCliente,
};