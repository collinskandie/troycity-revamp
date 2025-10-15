module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
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
        postedDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });

    return Job;
};
