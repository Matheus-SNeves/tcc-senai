const express = require('express');
const routes = express.Router();
const { validate, isCliente, isAdmin } = require('./middlewares/auth');
const genericController = require('./controllers/genericController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controllers Customizados
const login = require('./controllers/login');
const cadastro = require('./controllers/cadastro');

// Controllers Genéricos
const Usuario = require('./controllers/usuario');
const Empresa = genericController(prisma.empresa);
const Produto = genericController(prisma.produto);
const TipoEmprego = genericController(prisma.tipoEmprego);
const Endereco = genericController(prisma.endereco);
const Pedido = genericController(prisma.pedido);
const ItensPedido = genericController(prisma.itensPedido);
const Pagamento = genericController(prisma.pagamento);
const Avaliacao = genericController(prisma.avaliacao);

// Função auxiliar para criar rotas CRUD
const createCRUDRoutes = (path, controller, middlewares = []) => {
    routes.post(path, ...middlewares, controller.create);
    routes.get(path, ...middlewares, controller.read);
    routes.get(`${path}/:id`, ...middlewares, controller.readOne);
    routes.put(`${path}/:id`, ...middlewares, controller.update);
    routes.delete(`${path}/:id`, ...middlewares, controller.remove);
};

// Rotas Públicas (Login e Cadastro)
routes.post('/login', login.login);
routes.post('/cadastro', cadastro.createUsuario);
routes.get('/produtos', Produto.read); // Listagem de produtos é pública
routes.get('/produtos/:id', Produto.readOne);
routes.get('/empresas', Empresa.read); // Listagem de supermercados é pública

// Rotas Protegidas para Clientes (ou qualquer usuário logado)
routes.post('/pedidos', validate, isCliente, Pedido.create);
routes.get('/pedidos', validate, Pedido.read); // A lógica no controller já filtra por usuário
routes.get('/pedidos/:id', validate, Pedido.readOne);
routes.post('/avaliacoes', validate, isCliente, Avaliacao.create);
createCRUDRoutes('/enderecos', Endereco, [validate]);

// --- Rotas de Administrador ---
createCRUDRoutes('/usuarios', Usuario, [validate, isAdmin]);
createCRUDRoutes('/admin/empresas', Empresa, [validate, isAdmin]);
createCRUDRoutes('/admin/produtos', Produto, [validate, isAdmin]);
createCRUDRoutes('/admin/tipoempregos', TipoEmprego, [validate, isAdmin]);

module.exports = routes;