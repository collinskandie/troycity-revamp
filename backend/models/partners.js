module.exports = (sequelize, DataTypes) => {
    const OurPartners = sequelize.define(
        "OurPartners",
        {
            name: { type: DataTypes.STRING, allowNull: true },
            website: { type: DataTypes.STRING, allowNull: true },
            logo: { type: DataTypes.STRING, allowNull: true },
        }
    );

    return OurPartners;
};
