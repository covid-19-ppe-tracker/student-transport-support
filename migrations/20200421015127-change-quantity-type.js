'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.changeColumn(
      'Requirements',
      'quantity',
      {
        type: Sequelize.STRING,
        allowNull: true
      });
    return queryInterface.changeColumn(
      'Availabilities',
      'quantity',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'Requirements',
      'quantity',
      {
        type: Sequelize.DOUBLE,
        allowNull: false
      });
    return queryInterface.changeColumn(
      'Availabilities',
      'quantity',
      {
        type: Sequelize.DOUBLE,
        allowNull: false
      }
    );
  }
};
