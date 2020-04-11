'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.sequelize.query(`ALTER TABLE "Documents" DROP CONSTRAINT proofs_uri_key;`)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Documents',
      'uri',
      {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
    )
  }
};
