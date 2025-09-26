const { PrismaClient } = require('@prisma/client');
const { createHash } = require('../middlewares/auth');
const prisma = new PrismaClient();

async function seed(req, res) {
    const tipoAdmin = await prisma.tipoEmprego.create({
        data: {
            nome: 'Administrador',
            salario: 5000.00,
            carga_horaria: 40,
            descricao: 'Gerencia o sistema e as operações.'
        },
    });

    const empresaMatriz = await prisma.empresa.create({
        data: {
            nome: 'Speed Market Matriz',
            cnpj: '00.000.000/0001-00',
            email: 'matriz@speedmarket.com',
        },
    });

    const adminPassword = await createHash('admin123');
    const primeiroAdmin = await prisma.usuario.create({
        data: {
            nome: 'Admin Principal',
            cpf: '00000000000',
            telefone: '19999999999',
            email: 'admin@speedmarket.com',
            senha: adminPassword,
            role: 'ADMIN',
            id_empresa: empresaMatriz.id,
            id_tipo_empregado: tipoAdmin.id,
        },
    });
    const clientePassword = await createHash('cliente123');
    const primeiroCliente = await prisma.usuario.create({
        data: {
            nome: 'Cliente Exemplo',
            cpf: '11111111111',
            telefone: '19888888888',
            email: 'cliente@exemplo.com',
            senha: clientePassword,
            role: 'CLIENTE',
        },
    });

    res.json({
        admin: `Criado admin: ${primeiroAdmin.nome}`,
        cliente: `Criado cliente: ${primeiroCliente.nome}`
    });
}

module.exports = {
    seed
}