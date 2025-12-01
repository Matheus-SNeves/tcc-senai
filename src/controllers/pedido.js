const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const genericController = require('../utils/genericController');

const pedidoController = {
    create: async (req, res) => {
        // 1. Extração de Dados e ID do Usuário (Assumindo que req.user.id é injetado pelo middleware)
        const userId = req.user.id; 
        // Os dados esperados do front-end são valor, endereço (string), pagamento (objeto), e itens (array)
        const { valor, endereco, pagamento, itens } = req.body; 

        // 2. Validação de Dados de Entrada
        if (!userId || !valor || !endereco || !pagamento || !itens || itens.length === 0) {
            // Retorna 400 (Bad Request) para indicar que o front-end enviou dados inválidos.
            return res.status(400).json({ error: "Dados do pedido incompletos. O carrinho, endereço ou pagamento estão faltando." });
        }

        try {
            // 3. Iniciar Transação do Prisma para garantir atomicidade
            const novoPedido = await prisma.$transaction(async (tx) => {
                
                // 3.1. Criação do Pedido Principal
                const pedido = await tx.pedido.create({
                    data: {
                        id_usuario: userId,
                        valor_total: valor,
                        endereco_entrega: endereco, // Deve ser uma string ou objeto serializado
                        status: 'PROCESSANDO', 
                    },
                });

                // 3.2. Criação dos Itens do Pedido (Muitos para Muitos)
                const itensCriados = await Promise.all(
                    itens.map(item => tx.itens_pedido.create({ 
                        data: {
                            id_pedido: pedido.id,
                            id_produto: item.id_produto, // Chave estrangeira, deve existir!
                            quantidade: item.quantidade,
                            // Adicione outros campos necessários como 'preco_unitario'
                        },
                    }))
                );
                
                // 3.3. Criação do Registro de Pagamento
                const pagamentoCriado = await tx.pagamento.create({ 
                    data: {
                        id_pedido: pedido.id,
                        tipo: pagamento.tipo, 
                        valor: valor,
                        status: 'APROVADO', 
                    }
                });

                return { pedido, itensCriados, pagamentoCriado };
            });

            // 4. Sucesso: Retorna 201 (Created)
            return res.status(201).json({ 
                message: "Pedido criado com sucesso!", 
                pedido: novoPedido.pedido 
            });

        } catch (error) {
            // 5. Tratamento de Erro (Captura falhas do DB ou lógica)
            console.error("ERRO GRAVE NA TRANSAÇÃO DE PEDIDO (PRISMA/DB):", error);
            
            // Retorna 500 Internal Server Error para problemas de infraestrutura/lógica de backend
            return res.status(500).json({ 
                error: 'Erro interno do servidor ao finalizar o pedido. A transação falhou.', 
                // A chave 'details' é útil para depuração, mas deve ser removida em produção.
                details: error.message 
            });
        }
    },

    read: genericController(prisma.pedido).read,

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