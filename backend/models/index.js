// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const db = {};

// Explicitly import models
db.Job = require("./jobs")(sequelize, DataTypes);
db.ContactUs = require("./contactform")(sequelize, DataTypes);
db.OurTeam = require("./ourteam")(sequelize, DataTypes);
db.OurPartners = require("./partners")(sequelize, DataTypes);
db.Application = require("./Application")(sequelize, DataTypes);
db.MembershipRequest = require("./MembershipRequest")(sequelize, DataTypes);
db.Publication = require("./publications")(sequelize, DataTypes);
db.Newsletter = require("./newsletter")(sequelize, DataTypes);
db.AnnualReports = require("./annualreport")(sequelize, DataTypes);
db.ShortCourseApplication = require("./ShortCourseApplication")(sequelize, DataTypes);

// Apply associations if any (optional)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
