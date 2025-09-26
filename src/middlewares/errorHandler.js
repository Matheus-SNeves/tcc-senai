const { Prisma } = require('@prisma/client');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            const field = err.meta.target.join(', ');
            return res.status(409).json({
                message: `O ${field} informado já está cadastrado.`,
            });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({
                message: 'Registro não encontrado.',
            });
        }
    }

    return res.status(500).json({
        message: 'Erro interno do servidor.',
    });
};

module.exports = errorHandler;