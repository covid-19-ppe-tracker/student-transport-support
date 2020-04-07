'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Manufacturings',
      'quantity',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    ).then(function(){
      return queryInterface.addColumn(
        'Manufacturings',
        'remarks',
        {
          type: Sequelize.TEXT,
        }
      )
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Manufacturings',
      'quantity',
      {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
    ).then(function(){
      return queryInterface.removeColumn(
        'Manufacturings',
        'remarks'
      )
    })
  }
};
