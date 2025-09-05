const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const cliente = await prisma.cliente.create({
            data: req.body
        });
        return res.status(201).json(cliente);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const clientes = await prisma.cliente.findMany();
    return res.json(clientes);
}

const readOne = async (req, res) => {
    try {
        const cliente = await prisma.cliente.findUnique({
            select: {
                id: true,
                nome: true,
                cpf: true,
                telefone: true,
                email:true
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(cliente);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const cliente = await prisma.cliente.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(cliente);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.cliente.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

module.exports = { create, read, readOne, update, remove };
