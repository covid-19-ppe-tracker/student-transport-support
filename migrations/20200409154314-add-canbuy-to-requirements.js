'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Requirements',
      'canBuy',
      {
        type:Sequelize.BOOLEAN
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Requirements',
      'canBuy'
    )
  }
};
