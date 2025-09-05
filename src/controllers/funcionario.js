const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const funcionario = await prisma.funcionario.create({
            data: req.body
        });
        return res.status(201).json(funcionario);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const funcionarios = await prisma.funcionario.findMany();
    return res.json(funcionarios);
}

const readOne = async (req, res) => {
    try {
        const funcionario = await prisma.funcionario.findUnique({
            select: {
                id: true,
                nome: true,
                cpf: true,
                telefone: true,
                id_empresa:true,
                id_tipo_empregado:true,
                id_supermercado:true,
                empresa:{
                    select:{
                        nome:true
                    }
                },
                tipo_empregado:{
                    select:{
                        nome:true,
                        salario:true,
                        carga_horaria:true
                    }
                }
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(funcionario);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const funcionario = await prisma.funcionario.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(funcionario);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.funcionario.delete({
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