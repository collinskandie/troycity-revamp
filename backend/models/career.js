const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Career = sequelize.define('Career', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    postedDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = Career;
