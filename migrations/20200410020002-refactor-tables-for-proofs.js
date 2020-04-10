'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Documents',
      'ProofId',
      {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: 'Proofs',
          key: 'id'
        }
      },
    );
    await queryInterface.addColumn(
      'Availabilities',
      'ProofId',
      {
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        allowNull: true,
        references: {
          model: 'Proofs',
          key: 'id'
        }
      },
    );
    await queryInterface.addColumn(
      'Requirements',
      'ProofId',
      {
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        allowNull: true,
        references: {
          model: 'Proofs',
          key: 'id'
        }
      },
    );
    return  queryInterface.addColumn(
      'Manufacturings',
      'ProofId',
      {
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        allowNull: true,
        references: {
          model: 'Proofs',
          key: 'id'
        }
      },
    );
    
  },

  down: async (queryInterface, Sequelize) => {
    
    
    
    await queryInterface.removeColumn(
      'Manufacturings',
      'ProofId'
    );
    await queryInterface.removeColumn(
      'Requirements',
      'ProofId'
    );
    await queryInterface.removeColumn(
      'Availabilities',
      'ProofId'
    );
    return queryInterface.removeColumn(
      'Documents',
      'ProofId'
    );
  }
};
