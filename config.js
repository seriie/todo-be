const path = require('path');
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    DATA_PATH: path.join(__dirname, './database/data.json'),
    TASK_PATH: path.join(__dirname, './database/task.json'),
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
};
