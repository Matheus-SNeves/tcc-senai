const express = require('express');
const routes = express.Router();
const { validate } = require('./middlewares/auth');
const { validate: validateBody, loginSchema, cadastroSchema } = require('./middlewares/validate');
const errorHandler = require('./middlewares/errorHandler');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const login = require('./controllers/login');
const cadastroCliente = require('./controllers/cadastroCliente');
const cadastroAdm = require('./controllers/cadastroAdm');
const Pedido = require('./controllers/pedido');
const Avaliacao = require('./controllers/avaliacao');
const genericController = require('./utils/genericController');

const Usuario = genericController(prisma.usuario);
const Empresa = genericController(prisma.empresa);
const Produto = genericController(prisma.produto);
const TipoEmprego = genericController(prisma.tipoEmprego);
const Endereco = genericController(prisma.endereco);
const ItensPedido = genericController(prisma.itensPedido);
const Pagamento = genericController(prisma.pagamento);

const createCRUDRoutes = (path, controller, middlewares = []) => {
    routes.post(path, middlewares, controller.create);
    routes.get(path, middlewares, controller.read);
    routes.get(`${path}/:id`, middlewares, controller.readOne);
    routes.put(`${path}/:id`, middlewares, controller.update);
    routes.delete(`${path}/:id`, middlewares, controller.remove);
};

routes.get('/', (req, res) => {
    res.json({ titulo: 'API Speed Market funcionando, documentação em /docs' });
});

routes.post('/login', validateBody(loginSchema), login.login);
routes.post('/cadastro-cliente', validateBody(cadastroSchema), cadastroCliente.createCliente);
routes.post('/cadastro-adm', validateBody(cadastroSchema), cadastroAdm.createAdmin);

routes.post('/pedidos', validate, Pedido.create);
routes.get('/pedidos', validate, Pedido.read);
routes.get('/pedidos/:id', validate, Pedido.readOne);
routes.post('/avaliacoes', validate, Avaliacao.create);
routes.get('/avaliacoes', validate, Avaliacao.read);

createCRUDRoutes('/enderecos', Endereco, validate);
createCRUDRoutes('/usuarios', Usuario, validate);
createCRUDRoutes('/empresas', Empresa, validate);
createCRUDRoutes('/produtos', Produto, validate);
createCRUDRoutes('/tipoempregos', TipoEmprego, validate);
createCRUDRoutes('/itenspedidos', ItensPedido, validate);
createCRUDRoutes('/pagamentos', Pagamento, validate);

routes.use(errorHandler);

module.exports = routes;