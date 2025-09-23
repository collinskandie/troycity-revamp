// models/Application.js
module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define("Application", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cv: {
      type: DataTypes.STRING, // store filename
      allowNull: false
    },
    appliedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Application.associate = (models) => {
    Application.belongsTo(models.Job, {
      foreignKey: "jobId",
      as: "job"
    });
  };

  return Application;
};
