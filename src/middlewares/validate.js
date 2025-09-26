const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'O e-mail deve ser um endereço de e-mail válido.',
        'any.required': 'O e-mail é obrigatório.',
    }),
    senha: Joi.string().required().messages({
        'any.required': 'A senha é obrigatória.',
    }),
});

const cadastroSchema = Joi.object({
    nome: Joi.string().required().messages({
        'any.required': 'O nome é obrigatório.',
    }),
    cpf: Joi.string().required().length(14).pattern(/^(\d{3}\.\d{3}\.\d{3}-\d{2})$/).messages({
        'string.length': 'O CPF deve ter exatamente 14 caracteres (formato: 999.999.999-99).',
        'string.pattern.base': 'Formato de CPF inválido. Use 999.999.999-99.',
        'any.required': 'O CPF é obrigatório.',
    }),
    telefone: Joi.string().required().messages({
        'any.required': 'O telefone é obrigatório.',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'O e-mail deve ser um endereço de e-mail válido.',
        'any.required': 'O e-mail é obrigatório.',
    }),
    senha: Joi.string().min(6).required().messages({
        'string.min': 'A senha deve ter no mínimo 6 caracteres.',
        'any.required': 'A senha é obrigatória.',
    }),
    role: Joi.string().valid('CLIENTE', 'ADMIN').messages({
        'any.only': 'O papel deve ser CLIENTE ou ADMIN.',
    }),
});

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: 'Erros de validação', details: messages });
    }
    next();
};

module.exports = {
    validate,
    loginSchema,
    cadastroSchema,
};