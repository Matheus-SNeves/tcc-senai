const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const genericController = require('../utils/genericController');

const pedidoController = {
    create: genericController(prisma.pedido).create,

    read: async (req, res) => {
        try {
            const userId = req.user.id; 
            const pedidos = await prisma.pedido.findMany({
                // where: { id_usuario: userId }
                // include: {
                //     itens_pedido: {
                //         include: {
                //             produto: true 
                //         }
                //     }
                // }
            });
            return res.status(200).json(pedidos);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    readOne: async (req, res) => {
        try {
            const userId = req.user.id;
            const pedidoId = Number(req.params.id);
            const pedido = await prisma.pedido.findUnique({
                where: { id: pedidoId, id_usuario: userId },
                include: {
                    itens_pedido: {
                        include: {
                            produto: true
                        }
                    }
                }
            });
            if (!pedido) {
                return res.status(404).json({ error: 'Pedido não encontrado ou você não tem acesso a ele.' });
            }
            return res.status(200).json(pedido);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    update: genericController(prisma.pedido).update,
    remove: genericController(prisma.pedido).remove,
};

module.exports = pedidoController;