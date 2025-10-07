'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('owner', 'society', 'admin'),
      defaultValue: 'society'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('owner', 'society'),
      defaultValue: 'society'
    });
  }
};
