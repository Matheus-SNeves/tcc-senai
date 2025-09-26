const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const genericController = require('./genericController');

const Avaliacao = {
    create: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { id_produto, nota, comentario } = req.body;

            const novaAvaliacao = await prisma.avaliacao.create({
                data: {
                    id_usuario: userId,
                    id_produto: Number(id_produto),
                    nota: Number(nota),
                    comentario,
                },
            });
            res.status(201).json(novaAvaliacao);
        } catch (error) {
            next(error);
        }
    },
    read: genericController(prisma.avaliacao).read,
    readOne: genericController(prisma.avaliacao).readOne,
    update: genericController(prisma.avaliacao).update,
    remove: genericController(prisma.avaliacao).remove,
};

module.exports = Avaliacao;