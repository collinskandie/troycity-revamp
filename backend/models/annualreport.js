// models/AnnualReports.js
module.exports = (sequelize, DataTypes) => {
    const AnnualReports = sequelize.define('AnnualReports', {

        reportTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reportYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 1900,
                max: new Date().getFullYear()
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        reportUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     isUrl: true
            // }
        },
        submittedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

    return AnnualReports;
};
