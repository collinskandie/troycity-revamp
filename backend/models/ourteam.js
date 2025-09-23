module.exports = (sequelize, DataTypes) => {
    const OurTeam = sequelize.define('OurTeam', {
        fullName: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        imageUrl: { type: DataTypes.STRING, allowNull: true },
        facebook: { type: DataTypes.STRING, allowNull: true },
        googlePlus: { type: DataTypes.STRING, allowNull: true },
        twitter: { type: DataTypes.STRING, allowNull: true },
        linkedin: { type: DataTypes.STRING, allowNull: true },
    });
    return OurTeam;
};