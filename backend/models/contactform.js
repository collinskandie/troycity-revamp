module.exports = (sequelize, DataTypes) => {

    const ContactUs = sequelize.define('ContactUs', {
        fullName: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
    });

    return ContactUs;
};
