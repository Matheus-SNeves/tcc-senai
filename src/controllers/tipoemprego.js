const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const tipoEmprego = await prisma.tipoEmprego.create({
            data: req.body
        });
        return res.status(201).json(tipoEmprego);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const tiposEmprego = await prisma.tipoEmprego.findMany();
    return res.json(tiposEmprego);
}

const readOne = async (req, res) => {
    try {
        const tipoEmprego = await prisma.tipoEmprego.findUnique({
            select: {
                id: true,
                nome: true,
                salario: true,
                carga_horario: true,
                descricao:true
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(tipoEmprego);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const tipoEmprego = await prisma.tipoEmprego.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(tipoEmprego);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.tipoEmprego.delete({
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