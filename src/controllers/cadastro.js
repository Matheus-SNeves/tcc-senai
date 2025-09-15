const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createHash } = require('../middlewares/auth');

const createUsuario = async (req, res) => {
    const { nome, cpf, telefone, email, senha } = req.body;

    try {
        const emailExistente = await prisma.usuario.findUnique({ where: { email } });
        if (emailExistente) {
            return res.status(409).json({ message: 'O email informado já está cadastrado.' });
        }

        const cpfExistente = await prisma.usuario.findUnique({ where: { cpf } });
        if (cpfExistente) {
            return res.status(409).json({ message: 'O CPF informado já está cadastrado.' });
        }

        const hashedPassword = await createHash(senha);

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                cpf,
                telefone,
                email,
                senha: hashedPassword,
                role: 'CLIENTE', // Novos usuários são sempre clientes
            },
        });
        
        const { senha: _, ...usuarioSemSenha } = novoUsuario;
        res.status(201).json(usuarioSemSenha);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    createUsuario,
};