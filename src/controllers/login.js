const jsonwebtoken = require("jsonwebtoken");
const { validatePassword } = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const loginCliente = async (req, res) => {
    const { email, senha, validade } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const cliente = await prisma.cliente.findUnique({
            where: {
                email: email,
            }
        });

        if (!cliente) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const isValidPassword = await validatePassword(senha, cliente.senha);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const token = jsonwebtoken.sign(
            {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                role: 'CLIENTE',
            },
            process.env.SECRET_JWT,
            { expiresIn: validade ? validade + "min" : "60min" }
        );
        
        return res.status(200).json({ 
            token: token,
            usuario: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email
            }
        });

    } catch (err) {
        console.error('Erro no login do cliente:', err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const loginAdmin = async (req, res) => {
    const { email, senha, validade } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const admin = await prisma.funcionario.findUnique({
            where: {
                email: email,
            }
        });

        if (!admin) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const isValidPassword = await validatePassword(senha, admin.senha);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const token = jsonwebtoken.sign(
            {
                id: admin.id,
                nome: admin.nome,
                email: admin.email,
                role: 'ADMIN',
            },
            process.env.SECRET_JWT,
            { expiresIn: validade ? validade + "min" : "60min" }
        );

        return res.status(200).json({ 
            token: token,
            usuario: {
                id: admin.id,
                nome: admin.nome,
                email: admin.email
            }
        });

    } catch (err) {
        console.error('Erro no login do admin:', err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = {
    loginCliente,
    loginAdmin
};