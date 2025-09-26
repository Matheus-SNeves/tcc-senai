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

module.exports = {
    validate
};