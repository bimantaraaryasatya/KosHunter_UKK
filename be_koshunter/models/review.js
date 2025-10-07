'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    static associate(models) {
      review.belongsTo(models.kos, {foreignKey: 'kos_id'})
      review.belongsTo(models.user, {foreignKey: 'user_id'})
    }
  }
  review.init({
    kos_id: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'review',
  });
  return review;
};