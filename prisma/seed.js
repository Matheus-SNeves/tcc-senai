const { PrismaClient } = require('@prisma/client');
const { createHash } = require('../src/middlewares/auth'); 
const prisma = new PrismaClient();

async function main() {
    console.log(`Iniciando o processo de seed...`);

    // 1. Criar um Tipo de Emprego "Administrador"
    const tipoAdmin = await prisma.tipoEmprego.create({
        data: {
            nome: 'Administrador',
            salario: 5000.00,
            carga_horaria: 40,
            descricao: 'Gerencia o sistema e as operações.'
        },
    });
    console.log(`Criado tipo de emprego: ${tipoAdmin.nome}`);

    // 2. Criar a Empresa/Supermercado "Matriz"
    const empresaMatriz = await prisma.empresa.create({
        data: {
            nome: 'Speed Market Matriz',
            cnpj: '00.000.000/0001-00',
            email: 'matriz@speedmarket.com',
        },
    });
    console.log(`Criada empresa: ${empresaMatriz.nome}`);

    // 3. Criar o primeiro Funcionário (Admin)
    const adminPassword = await createHash('admin123'); 
    const primeiroAdmin = await prisma.funcionario.create({
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
    console.log(`Criado admin: ${primeiroAdmin.nome} (email: ${primeiroAdmin.email})`);

    console.log(`Seed finalizado com sucesso.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });