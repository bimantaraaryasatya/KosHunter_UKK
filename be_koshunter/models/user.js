'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasMany(models.kos, {foreignKey: 'user_id'});
      user.hasMany(models.review, {foreignKey: 'user_id'});
      user.hasMany(models.review, {foreignKey: 'user_id'})
    }
  }
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    role: DataTypes.ENUM('owner', 'society', 'admin')
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};