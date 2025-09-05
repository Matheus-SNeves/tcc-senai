const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const produto = await prisma.produto.create({
            data: req.body
        });
        return res.status(201).json(produto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const produtos = await prisma.produto.findMany();
    return res.json(produtos);
}

const readOne = async (req, res) => {
    try {
        const produto = await prisma.produto.findUnique({
            select: {
                id: true,
                nome: true,
                preco: true,
                quantidade: true,
                descricao:true,
                id_supermercado:true,
                supermercado:{
                    select:{
                        nome:true
                    }
                }
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(produto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const produto = await prisma.produto.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(produto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.produto.delete({
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