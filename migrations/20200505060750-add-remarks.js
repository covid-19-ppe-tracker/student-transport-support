'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Availabilities',
      'remarks',
      {
        type: Sequelize.TEXT,
        allowNull: true
      }
    )
    return queryInterface.addColumn(
      'Requirements',
      'remarks',
      {
        type: Sequelize.TEXT,
        allowNull: true
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Availabilities',
      'remarks'
    )
    return queryInterface.removeColumn(
      'Requirements',
      'remarks'
    )
  }
};
