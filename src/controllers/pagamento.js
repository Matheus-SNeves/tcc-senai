const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const pagamento = await prisma.pagamento.create({
            data: req.body
        });
        return res.status(201).json(pagamento);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const pagamentos = await prisma.pagamento.findMany();
    return res.json(pagamentos);
}

const readOne = async (req, res) => {
    try {
        const pagamento = await prisma.pagamento.findUnique({
            select: {
                id: true,
                id_pedido: true,
                tipo: true,
                data_pagamento: true,
                pedido: {
                    select: {
                        valor: true,
                        cliente: {
                            select:{
                            nome: true
                            }
                        }
                    }
                }
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(pagamento);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const pagamento = await prisma.pagamento.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(pagamento);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.pagamento.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

module.exports = {
    create,
    read,
    readOne,
    update,
    remove
};