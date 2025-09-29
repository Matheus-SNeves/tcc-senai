const transformForeignKeyIds = (data) => {
    const newData = {};
    for (const key in data) {
        if (key.startsWith('id_') && typeof data[key] === 'number') {
            const relationName = key.substring(3);
            newData[relationName] = {
                connect: {
                    id: data[key],
                },
            };
        } else {
            newData[key] = data[key];
        }
    }
    return newData;
};

const genericController = (prismaModel) => ({
    create: async (req, res, next) => {
        try {
            const data = transformForeignKeyIds(req.body);
            const record = await prismaModel.create({ data });
            res.status(201).json(record);
        } catch (error) {
            next(error);
        }
    },

    read: async (req, res, next) => {
        try {
            const records = await prismaModel.findMany();
            res.status(200).json(records);
        } catch (error) {
            next(error);
        }
    },

    readOne: async (req, res, next) => {
        try {
            const record = await prismaModel.findUnique({ where: { id: Number(req.params.id) } });
            if (!record) {
                return res.status(404).json({ error: 'Registro não encontrado.' });
            }
            res.status(200).json(record);
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const data = transformForeignKeyIds(req.body);
            const record = await prismaModel.update({
                where: { id: Number(req.params.id) },
                data, 
            });
            res.status(202).json(record);
        } catch (error) {
            next(error);
        }
    },

    remove: async (req, res, next) => {
        try {
            await prismaModel.delete({ where: { id: Number(req.params.id) } });
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
});

module.exports = genericController;