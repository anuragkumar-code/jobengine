const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.js")(sequelize, Sequelize);
db.Job = require("./job.js")(sequelize, Sequelize);
db.Application = require("./application.js")(sequelize, Sequelize);

// Set up associations
db.User.hasMany(db.Application);
db.Application.belongsTo(db.User);

db.Job.hasMany(db.Application);
db.Application.belongsTo(db.Job);

module.exports = db;
