const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createHash } = require('../middlewares/auth');

const createCliente = async (req, res) => {
    const { nome, cpf, telefone, email, senha } = req.body;

    try {
        const emailExistente = await prisma.cliente.findUnique({
            where: { email },
        });

        if (emailExistente) {
            return res.status(409).json({ message: 'O email informado já está cadastrado.' });
        }

        const cpfExistente = await prisma.cliente.findUnique({
            where: { cpf },
        });

        if (cpfExistente) {
            return res.status(409).json({ message: 'O CPF informado já está cadastrado.' });
        }

        const hashedPassword = await createHash(senha);

        const novoCliente = await prisma.cliente.create({
            data: {
                nome,
                cpf,
                telefone,
                email,
                senha: hashedPassword,
            },
        });
        
        const { senha: _, ...clienteSemSenha } = novoCliente;

        res.status(201).json(clienteSemSenha);
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const createAdmin = async (req, res) => {
    const { nome, cpf, telefone, email, senha } = req.body;

    try {
        const emailExistente = await prisma.funcionario.findUnique({
            where: { email },
        });

        if (emailExistente) {
            return res.status(409).json({ message: 'O e-mail informado já está cadastrado para um funcionário.' });
        }

        const cpfExistente = await prisma.funcionario.findUnique({
            where: { cpf },
        });

        if (cpfExistente) {
            return res.status(409).json({ message: 'O CPF informado já está cadastrado para um funcionário.' });
        }

        const hashedPassword = await createHash(senha);

        const novoAdmin = await prisma.funcionario.create({
            data: {
                nome,
                cpf,
                telefone,
                email,
                senha: hashedPassword,
                role: 'ADMIN', 
            },
        });
        
        const { senha: _, ...adminSemSenha } = novoAdmin;

        res.status(201).json(adminSemSenha);
    } catch (error) {
        console.error('Erro ao cadastrar administrador:', error);
        res.status(500).json({ message: 'Erro ao cadastrar administrador. Por favor, tente novamente mais tarde.' });
    }
}

module.exports = {
    createCliente,
    createAdmin 
};