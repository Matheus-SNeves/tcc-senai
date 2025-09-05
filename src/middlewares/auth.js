    const jsonwebtoken = require("jsonwebtoken");
    const bcrypt = require('bcrypt');

    const validate = (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).send({ message: "Acesso negado. Nenhum token recebido." });

        try {
            const payload = jsonwebtoken.verify(token, process.env.SECRET_JWT);
            req.user = payload;
            next();
        } catch (err) {
            return res.status(401).send({ message: "Token inválido ou expirado." });
        }
    }

    const isAdmin = (req, res, next) => {
        const user = req.user;
        if (user && user.role === 'ADMIN') {
            next();
        } else {
            res.status(403).send({ message: "Acesso negado. Apenas administradores podem acessar esta rota." });
        }
    }

    const isCliente = (req, res, next) => {
        const user = req.user;
        if (user && user.role === 'CLIENTE') {
            next();
        } else {
            res.status(403).send({ message: "Acesso negado. Apenas clientes podem acessar esta rota." });
        }
    }

    const createHash = async (senha) => {
        if (!senha) return null;
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(senha, salt);
            return hash;
        } catch (error) {
            throw new Error('Erro ao criar hash');
        }   
    }

    const validatePassword = async (senha, hash) => {
        if (!senha || !hash) return false;
        try {
            return await bcrypt.compare(senha, hash);
        } catch (error) {
            throw new Error('Erro ao validar senha');
        }
    }

    module.exports = {
        validate,
        isAdmin,
        isCliente,
        createHash,
        validatePassword
    };