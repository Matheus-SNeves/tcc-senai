const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// const genericController = require('../utils/genericController'); // Mantemos para as outras operações

const pedidoController = {
    // A função CREATE precisa ser personalizada para lidar com Pedido, ItensPedido e Pagamento
    create: async (req, res) => {
        // 1. Extrair dados e ID do Usuário (Assumindo que req.user.id é injetado pelo middleware de autenticação)
        const userId = req.user.id; 
        const { valor, endereco, pagamento, itens } = req.body; // Dados vindos do Front-end

        // 2. Validação de Dados de Entrada
        if (!userId || !valor || !endereco || !pagamento || !itens || itens.length === 0) {
            // Retorna 400 (Bad Request) em vez de 500 para dados faltantes.
            return res.status(400).json({ error: "Dados do pedido incompletos ou inválidos." });
        }

        try {
            // 3. Iniciar Transação do Prisma
            const novoPedido = await prisma.$transaction(async (tx) => {
                
                // 3.1. Criação do Pedido Principal (tabela 'pedido')
                const pedido = await tx.pedido.create({
                    data: {
                        id_usuario: userId,
                        valor_total: valor,
                        endereco_entrega: endereco,
                        status: 'PROCESSANDO', // Status inicial
                        // data_pedido será preenchido automaticamente se for 'DateTime'
                    },
                });

                // 3.2. Criação dos Itens do Pedido (tabela 'itens_pedido')
                const itensCriados = await Promise.all(
                    itens.map(item => tx.itens_pedido.create({ // Use 'itens_pedido' conforme seu schema
                        data: {
                            id_pedido: pedido.id,
                            id_produto: item.id_produto, 
                            quantidade: item.quantidade,
                            // Se o preço for salvo aqui, adicione: preco_unitario: item.preco_unitario
                        },
                    }))
                );
                
                // 3.3. Criação do Registro de Pagamento (tabela 'pagamento')
                const pagamentoCriado = await tx.pagamento.create({ // Use 'pagamento' conforme seu schema
                    data: {
                        id_pedido: pedido.id,
                        tipo: pagamento.tipo, // Ex: 'PIX', 'CARTAO_CREDITO'
                        valor: valor,
                        status: 'APROVADO', // Assumindo aprovação imediata para PIX/Cartão
                        // Outros detalhes de pagamento, se houver
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
            // 5. Tratamento de Erro (Garantindo que o 500 tenha contexto)
            console.error("ERRO NO PROCESSAMENTO DA TRANSAÇÃO DE PEDIDO:", error);
            
            // Retorna 500 para falhas na lógica do servidor ou no DB
            // Para erros de chave estrangeira (ex: Produto não existe), o Prisma lança uma exceção.
            return res.status(500).json({ 
                error: 'Erro interno do servidor ao finalizar o pedido.', 
                details: 'Falha na transação do banco de dados. Verifique a validade dos IDs de produtos ou a conexão com o DB.' 
            });
        }
    },
    
    // update: genericController(prisma.pedido).update,
    // remove: genericController(prisma.pedido).remove,
    // read: genericController(prisma.pedido).read, 
    // ... (Mantenha o restante do controller inalterado)

    readAllByUser: async (req, res) => {
        // ... (código existente)
    },

    readOne: async (req, res) => {
        // ... (código existente)
    },
};

module.exports = pedidoController;