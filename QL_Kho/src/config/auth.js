const bcrypt = require('bcryptjs');

const roles = {
    admin: 'admin',
    staff: 'staff',
    manager: 'manager'
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    roles,
    hashPassword,
    comparePassword
};