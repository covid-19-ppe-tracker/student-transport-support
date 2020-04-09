'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn(
      'proofs',
      'name'
    )
      .then(function () {
        return queryInterface.removeColumn(
          'proofs',
          'kind'
        )
      })
      .then(function () {
        return queryInterface.sequelize.query("DROP TYPE \"enum_proofs_kind\";")
      })
      .then(function () {
        return queryInterface.renameTable(
          'proofs', 'Documents'
        )
      })
      .then(function () {
        return queryInterface.addColumn(
          'Documents',
          'kind',
          {
            type: Sequelize.ENUM,
            values: ['file', 'hyperlink'],
          }
        )
      })
  },

  down: (queryInterface, Sequelize) => {


    return queryInterface.removeColumn(
      'Documents',
      'kind'
    )
      .then(function () {
        return queryInterface.sequelize.query("DROP TYPE \"enum_Documents_kind\";")
      })
      .then(function () {
        return queryInterface.renameTable('Documents', 'proofs')
      })
      .then(function () {
        return queryInterface.addColumn(
          'proofs',
          'kind',
          {
            type: Sequelize.ENUM,
            values: ['document', 'hyperlink', 'manual'],
          }
        )
      })
      .then(function () {
        return queryInterface.addColumn(
          'proofs',
          'name',
          {
            type: Sequelize.STRING
          }
        )
      })

  }
};
