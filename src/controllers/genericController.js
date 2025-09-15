// src/controllers/genericController.js

const genericController = (prismaModel) => ({
    create: async (req, res) => {
        try {
            const record = await prismaModel.create({ data: req.body });
            return res.status(201).json(record);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    
    read: async (req, res) => {
        try {
            const records = await prismaModel.findMany();
            return res.status(200).json(records);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    readOne: async (req, res) => {
        try {
            const record = await prismaModel.findUnique({ where: { id: Number(req.params.id) } });
            if (!record) {
                return res.status(404).json({ error: 'Registro não encontrado.' });
            }
            return res.status(200).json(record);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const record = await prismaModel.update({
                where: { id: Number(req.params.id) },
                data: req.body,
            });
            return res.status(202).json(record);
        } catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Registro não encontrado.' });
            }
            return res.status(400).json({ error: error.message });
        }
    },

    remove: async (req, res) => {
        try {
            await prismaModel.delete({ where: { id: Number(req.params.id) } });
            return res.status(204).send();
        } catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Registro não encontrado.' });
            }
            return res.status(500).json({ error: error.message });
        }
    },
});

module.exports = genericController;