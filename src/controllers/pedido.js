const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const genericController = require('../utils/genericController');

const pedidoController = {
    create: genericController(prisma.pedido).create,

// controllers/pedido.js (A função read)

read: async (req, res) => {
    try {
        const userRole = req.user.role; 
        const userId = req.user.id;

        // Se o usuário logado for ADMIN, o filtro fica vazio (vê todos os pedidos).
        // Se for CLIENTE, filtra pelo id do usuário.
        const whereClause = userRole === 'CLIENTE' ? { id_usuario: userId } : {};
        
        const pedidos = await prisma.pedido.findMany({
            where: whereClause,
            // ISTO É CRUCIAL: Adiciona os dados de Pagamento e Cliente na resposta da API
            include: {
                pagamento: true, // <== GARANTE QUE pedido.pagamento EXISTA
                usuario: { select: { nome: true, email: true } }, // <== GARANTE QUE pedido.usuario.nome EXISTA
                itens_pedido: { 
                    include: { produto: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(pedidos);
    } catch (error) {
        // ... tratamento de erro
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