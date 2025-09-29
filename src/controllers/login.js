const jsonwebtoken = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validatePassword } = require('../middlewares/bcrypt');

const login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario || !(await validatePassword(senha, usuario.senha))) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const token = jsonwebtoken.sign(
            { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
            process.env.SECRET_JWT,
            { expiresIn: "30d" }
        );

        return res.status(200).json({
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { login };