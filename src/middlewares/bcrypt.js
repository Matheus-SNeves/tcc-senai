const bcrypt = require('bcrypt');

const createHash = async (senha) => {
    if (!senha) {
        throw new Error('A senha não pode ser nula.');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);
    return hash;
};

const validatePassword = async (senha, hash) => {
    if (!senha || !hash) {
        return false;
    }
    return await bcrypt.compare(senha, hash);
};

module.exports = {
    createHash,
    validatePassword,
};