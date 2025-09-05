const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const avaliacao = await prisma.avaliacao.create({
            data: req.body
        });
        return res.status(201).json(avaliacao);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const avaliacoes = await prisma.avaliacao.findMany();
    return res.json(avaliacoes);
}

const readOne = async (req, res) => {
    try {
        const avaliacao = await prisma.avaliacao.findUnique({
            select: {
                id: true,
                id_cliente: true,
                id_produto: true,
                nota: true,
                comentario:true,
                data_avaliacao:true,
                cliente:{
                    select:{
                        nome:true
                    }
                },
                produto:{
                    select:{
                        nome:true
                    }
                }
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(avaliacao);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const avaliacao = await prisma.avaliacao.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(avaliacao);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.avaliacao.delete({
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