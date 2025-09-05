const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const itensPedido = await prisma.itensPedido.create({
            data: req.body
        });
        return res.status(201).json(itensPedido);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const itensPedidos = await prisma.itensPedido.findMany();
    return res.json(itensPedidos);
}

const readOne = async (req, res) => {
    try {
        const itensPedido = await prisma.itensPedido.findUnique({
            select: {
                id: true,
                id_pedido: true,
                id_produto: true,
                quantidade: true,
                pedido:{
                    select:{
                        valor:true,
                        data_pedido:true,
                        cliente:{
                            select:{
                                nome:true
                            }
                        }
                    }
                },
                produto:{
                    select:{
                        nome:true,
                        preco:true,
                        supermercado:{
                            select:{
                                nome:true
                            }
                        }
                    }
                }
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(itensPedido);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const itensPedido = await prisma.itensPedido.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(itensPedido);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.itensPedido.delete({
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