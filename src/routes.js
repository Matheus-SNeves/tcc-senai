const express = require('express');
const routes = express.Router();
const { validate, isCliente, isAdmin } = require('./middlewares/auth');
const genericController = require('./controllers/genericController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


routes.get('/', (req, res) => {
    res.json({
        rotas: [
            {
                grupo: "Autenticação e Público",
                descricao: "Rotas de login, cadastro e acesso a recursos públicos.",
                CREATE: [
                    { titulo: "Login de Cliente/Admin", rota: "/login", tipo: "POST", acesso: "Público" },
                    { titulo: "Cadastro de Cliente", rota: "/cadastro", tipo: "POST", acesso: "Público" }
                ],
                READ: [
                    { titulo: "Listar Produtos", rota: "/produtos", tipo: "GET", acesso: "Público" },
                    { titulo: "Buscar Produto por ID", rota: "/produtos/:id", tipo: "GET", acesso: "Público" },
                    { titulo: "Listar Empresas/Supermercados", rota: "/empresas", tipo: "GET", acesso: "Público" }
                ]
            },
            {
                grupo: "Rotas de Cliente",
                descricao: "Rotas protegidas para usuários do tipo 'CLIENTE'.",
                CREATE: [
                    { titulo: "Criar Pedido", rota: "/pedidos", tipo: "POST", acesso: "Protegido (Cliente)" },
                    { titulo: "Criar Avaliação", rota: "/avaliacoes", tipo: "POST", acesso: "Protegido (Cliente)" },
                    { titulo: "Criar Endereço", rota: "/enderecos", tipo: "POST", acesso: "Protegido" }
                ],
                READ: [
                    { titulo: "Listar Meus Pedidos", rota: "/pedidos", tipo: "GET", acesso: "Protegido" },
                    { titulo: "Ver Detalhes do Pedido", rota: "/pedidos/:id", tipo: "GET", acesso: "Protegido" },
                    { titulo: "Listar Meus Endereços", rota: "/enderecos", tipo: "GET", acesso: "Protegido" },
                    { titulo: "Buscar Endereço por ID", rota: "/enderecos/:id", tipo: "GET", acesso: "Protegido" }
                ],
                UPDATE: [
                    { titulo: "Atualizar Endereço", rota: "/enderecos/:id", tipo: "PUT", acesso: "Protegido" }
                ],
                DELETE: [
                    { titulo: "Deletar Endereço", rota: "/enderecos/:id", tipo: "DELETE", acesso: "Protegido" }
                ]
            },
            {
                grupo: "Rotas de Administrador",
                descricao: "Rotas exclusivas para usuários do tipo 'ADMIN'.",
                CREATE: [
                    { titulo: "Criar Usuário", rota: "/usuarios", tipo: "POST", acesso: "Admin" },
                    { titulo: "Criar Empresa", rota: "/admin/empresas", tipo: "POST", acesso: "Admin" },
                    { titulo: "Criar Produto", rota: "/admin/produtos", tipo: "POST", acesso: "Admin" },
                    { titulo: "Criar Tipo de Emprego", rota: "/admin/tipoempregos", tipo: "POST", acesso: "Admin" }
                ],
                READ: [
                    { titulo: "Listar Usuários", rota: "/usuarios", tipo: "GET", acesso: "Admin" },
                    { titulo: "Buscar Usuário por ID", rota: "/usuarios/:id", tipo: "GET", acesso: "Admin" },
                    { titulo: "Listar Empresas", rota: "/admin/empresas", tipo: "GET", acesso: "Admin" },
                    { titulo: "Buscar Empresa por ID", rota: "/admin/empresas/:id", tipo: "GET", acesso: "Admin" },
                    { titulo: "Listar Produtos", rota: "/admin/produtos", tipo: "GET", acesso: "Admin" },
                    { titulo: "Buscar Produto por ID", rota: "/admin/produtos/:id", tipo: "GET", acesso: "Admin" },
                    { titulo: "Listar Tipos de Emprego", rota: "/admin/tipoempregos", tipo: "GET", acesso: "Admin" },
                    { titulo: "Buscar Tipo de Emprego por ID", rota: "/admin/tipoempregos/:id", tipo: "GET", acesso: "Admin" }
                ],
                UPDATE: [
                    { titulo: "Atualizar Usuário", rota: "/usuarios/:id", tipo: "PUT", acesso: "Admin" },
                    { titulo: "Atualizar Empresa", rota: "/admin/empresas/:id", tipo: "PUT", acesso: "Admin" },
                    { titulo: "Atualizar Produto", rota: "/admin/produtos/:id", tipo: "PUT", acesso: "Admin" },
                    { titulo: "Atualizar Tipo de Emprego", rota: "/admin/tipoempregos/:id", tipo: "PUT", acesso: "Admin" }
                ],
                DELETE: [
                    { titulo: "Deletar Usuário", rota: "/usuarios/:id", tipo: "DELETE", acesso: "Admin" },
                    { titulo: "Deletar Empresa", rota: "/admin/empresas/:id", tipo: "DELETE", acesso: "Admin" },
                    { titulo: "Deletar Produto", rota: "/admin/produtos/:id", tipo: "DELETE", acesso: "Admin" },
                    { titulo: "Deletar Tipo de Emprego", rota: "/admin/tipoempregos/:id", tipo: "DELETE", acesso: "Admin" }
                ]
            }
        ]
    })
})
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
