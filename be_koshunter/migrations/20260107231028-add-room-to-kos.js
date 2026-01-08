'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('kos', 'total_room', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'gender'
    })

    await queryInterface.addColumn('kos', 'available_room', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'total_room'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('kos', 'total_room')
    await queryInterface.removeColumn('kos', 'available_room')
  }
};
