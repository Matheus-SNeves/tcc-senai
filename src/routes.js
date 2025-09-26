const express = require('express');
const routes = express.Router();
const { validate, isCliente, isAdmin } = require('./middlewares/auth');
const { validate: validateBody, loginSchema, cadastroSchema } = require('./middlewares/validate');
const errorHandler = require('./middlewares/errorHandler');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const login = require('./controllers/login');
const cadastro = require('./controllers/cadastro');
const Pedido = require('./controllers/pedido');
const Avaliacao = require('./controllers/avaliacao'); 
const genericController = require('./controllers/genericController');

const Usuario = genericController(prisma.usuario);
const Empresa = genericController(prisma.empresa);
const Produto = genericController(prisma.produto);
const TipoEmprego = genericController(prisma.tipoEmprego);
const Endereco = genericController(prisma.endereco);

const createCRUDRoutes = (path, controller, middlewares = []) => {
    routes.post(path, ...middlewares, controller.create);
    routes.get(path, ...middlewares, controller.read);
    routes.get(`${path}/:id`, ...middlewares, controller.readOne);
    routes.put(`${path}/:id`, ...middlewares, controller.update);
    routes.delete(`${path}/:id`, ...middlewares, controller.remove);
};

routes.post('/login', validateBody(loginSchema), login.login);
routes.post('/cadastro', validateBody(cadastroSchema), cadastro.createUsuario);
routes.get('/produtos', Produto.read);
routes.get('/produtos/:id', Produto.readOne);
routes.get('/empresas', Empresa.read);

routes.post('/pedidos', validate, isCliente, Pedido.create);
routes.get('/pedidos', validate, Pedido.read);
routes.get('/pedidos/:id', validate, Pedido.readOne);
routes.post('/avaliacoes', validate, isCliente, Avaliacao.create);
createCRUDRoutes('/enderecos', Endereco, [validate]);

createCRUDRoutes('/usuarios', Usuario, [validate, isAdmin]);
createCRUDRoutes('/admin/empresas', Empresa, [validate, isAdmin]);
createCRUDRoutes('/admin/produtos', Produto, [validate, isAdmin]);
createCRUDRoutes('/admin/tipoempregos', TipoEmprego, [validate, isAdmin]);

routes.use(errorHandler);

module.exports = routes;