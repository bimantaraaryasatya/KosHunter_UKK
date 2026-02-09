'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('books', 'invoice_file', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'status'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('books', 'invoice_file');
  }
};
