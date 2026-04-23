'use strict';

const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ── Modelos ─────────────────────────────────────────────
db.Autos    = require('./autos')(sequelize, Sequelize.DataTypes);
db.Cliente  = require('./cliente')(sequelize, Sequelize.DataTypes);
db.Alquiler = require('./alquiler')(sequelize, Sequelize.DataTypes);

// ── Asociaciones ────────────────────────────────────────
Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

db.sequelize.sync()
  .then(() => console.log('Tablas sincronizadas ✅'))
  .catch(err => console.log('Error al sincronizar:', err));

module.exports = db;
