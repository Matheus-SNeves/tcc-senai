const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createHash } = require('../middlewares/bcrypt');

const createCliente = async (req, res, next) => {
    try {
        const { nome, cpf, telefone, email, senha } = req.body;
        const hashedPassword = await createHash(senha);

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                cpf,
                telefone,
                email,
                senha: hashedPassword,
                role: 'CLIENTE',
            },
        });

        const { senha: _, ...usuarioSemSenha } = novoUsuario;
        res.status(201).json(usuarioSemSenha);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCliente,
};