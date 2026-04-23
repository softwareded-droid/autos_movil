'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Autos extends Model {
    static associate(models) {
      Autos.hasMany(models.Alquiler, { foreignKey: 'autoId' });
    }
  }

  Autos.init({
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    valorAlquiler: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    anio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disponibilidad: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Autos',
    tableName: 'autos',
  });

  return Autos;
};
