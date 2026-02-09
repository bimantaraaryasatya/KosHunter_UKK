'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    static associate(models) {
      book.belongsTo(models.kos, {foreignKey: 'kos_id', as:'kos'})
      book.belongsTo(models.user, {foreignKey: 'user_id', as:'user'})
    }
  }
  book.init({
    kos_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    status: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    invoice_file: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};