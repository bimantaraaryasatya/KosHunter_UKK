'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kos_fasilitie extends Model {
    static associate(models) {
      kos_fasilitie.belongsTo(models.kos, {foreignKey: 'kos_id'})
    }
  }
  kos_fasilitie.init({
    kos_id: DataTypes.INTEGER,
    fasility: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kos_fasilitie',
  });
  return kos_fasilitie;
};