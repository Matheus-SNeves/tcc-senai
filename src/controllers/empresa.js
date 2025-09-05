const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const empresa = await prisma.empresa.create({
            data: req.body
        });
        return res.status(201).json(empresa);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const empresas = await prisma.empresa.findMany();
    return res.json(empresas);
}

const readOne = async (req, res) => {
    try {
        const empresa = await prisma.empresa.findUnique({
            select:{
                id: true,
                nome: true,
                cnpj: true,
                email:true
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(empresa);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const empresa = await prisma.empresa.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(empresa);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.empresa.delete({
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