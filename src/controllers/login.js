const jsonwebtoken = require("jsonwebtoken");
const { validatePassword } = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario || !(await validatePassword(senha, usuario.senha))) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const token = jsonwebtoken.sign(
            { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
            process.env.SECRET_JWT,
            { expiresIn: "60min" }
        );
        
        return res.status(200).json({ 
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role }
        });

    } catch (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = { login };