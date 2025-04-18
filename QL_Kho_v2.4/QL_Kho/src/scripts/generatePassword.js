const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Kết nối đến cơ sở dữ liệu

const plainPassword = '123';

bcrypt.hash(plainPassword, 10)
    .then(hashed => {
        const insertQuery = `INSERT INTO users (username, password, role) VALUES ('admin2', '${hashed}', 'admin')`;
        console.log(insertQuery);

        // Ví dụ chèn vào cơ sở dữ liệu
        return db.query(insertQuery);
    })
    .then(result => {
        console.log('User added successfully:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });