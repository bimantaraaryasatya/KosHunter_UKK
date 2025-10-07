'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kos_image extends Model {
    static associate(models) {
      kos_image.belongsTo(models.kos, {foreignKey: 'kos_id'});
    }
  }
  kos_image.init({
    kos_id: DataTypes.INTEGER,
    file: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kos_image',
  });
  return kos_image;
};