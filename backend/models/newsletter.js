// models/Newsletter.js
module.exports = (sequelize, DataTypes) => {
    const Newsletter = sequelize.define('Newsletter', {
        
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        submittedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

    return Newsletter;
};
