module.exports = (sequelize, DataTypes) => {
    const Publication = sequelize.define('Publication', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        buttonLink: {
            type: DataTypes.STRING,
            allowNull: true
        },
        postedDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
    });

    return Publication;
};
