// models/MembershipRequest.js
module.exports = (sequelize, DataTypes) => {
    const MembershipRequest = sequelize.define('MembershipRequest', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        organization: {
            type: DataTypes.STRING,
            allowNull: true
        },
        plan: {
            type: DataTypes.ENUM("individual", "corporate", "community"),
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        submittedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

    return MembershipRequest;
};
