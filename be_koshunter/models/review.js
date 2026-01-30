'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    static associate(models) {
      review.belongsTo(models.kos, {
        as: 'kos',
        foreignKey: 'kos_id'
      })

      review.belongsTo(models.user, {
        foreignKey: 'user_id'
      })

      // self reference
      review.belongsTo(models.review, {
        as: 'parent',
        foreignKey: 'parent_id'
      })

      review.hasMany(models.review, {
        as: 'replies',
        foreignKey: 'parent_id'
      })
    }
  }

  review.init(
    {
      kos_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'review',
      tableName: 'reviews',
      timestamps: true
    }
  )

  return review
}
