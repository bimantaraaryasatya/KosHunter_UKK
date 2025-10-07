'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    static associate(models) {
      book.belongsTo(models.kos, {foreignKey: 'kos_id'})
      book.belongsTo(models.user, {foreignKey: 'user_id'})
    }
  }
  book.init({
    kos_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    status: DataTypes.ENUM('pending', 'accepted', 'rejected')
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};