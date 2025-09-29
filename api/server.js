const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger.json');
const routes = require('../src/routes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(routes);

const PORT = process.env.PORT || 1243;
app.listen(PORT, (req, res) => {
    console.log(`API respondendo em http://localhost:${PORT}`);
    console.log(`Documentação em http://localhost:${PORT}/docs`);
});