'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kos extends Model {
    static associate(models) {
      kos.belongsTo(models.user, {foreignKey: 'user_id'});
      kos.hasMany(models.kos_image, {foreignKey: 'kos_id'});
      kos.hasMany(models.kos_fasilitie, {foreignKey: 'kos_id'});
      kos.hasMany(models.review, {foreignKey: 'kos_id'});
      kos.hasMany(models.book, {foreignKey: 'kos_id'});
    }
  }
  kos.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    price_per_month: DataTypes.INTEGER,
    gender: {
      type: DataTypes.ENUM('male', 'female', 'all'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['male', 'female', 'all']],
          msg: "Gender must be one of 'male', 'female', or 'all'"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'kos',
  });
  return kos;
};