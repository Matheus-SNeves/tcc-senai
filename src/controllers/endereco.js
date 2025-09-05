const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const endereco = await prisma.endereco.create({
            data: req.body
        });
        return res.status(201).json(endereco);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const enderecos = await prisma.endereco.findMany();
    return res.json(enderecos);
}

const readOne = async (req, res) => {
    try {
        const endereco = await prisma.endereco.findUnique({
            select: {
                id: true,
                cep: true,
                logradouro: true,
                numero: true,
                complemento:true,
                bairro:true,
                id_cliente:true,
                id_empresa:true,
                id_funcionario:true,
                empresa:{
                    select:{
                        nome:true
                    }
                },
                cliente:{
                    select:{
                        nome:true
                    }
                },
                funcionario:{
                    select:{
                        nome:true
                    }
                }
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(endereco);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const endereco = await prisma.endereco.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(endereco);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.endereco.delete({
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