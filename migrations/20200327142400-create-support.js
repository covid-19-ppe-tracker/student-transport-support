'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Support', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      source: {
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        allowNull: false,
        references: {
          model: 'Location',
          key: 'id'
        }
      },
      sourceLatitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      sourceLongitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },

      destination: {
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        allowNull: false,
        references: {
          model: 'Location',
          key: 'id'
        }
      },
      destinationLatitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      destinationLongitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },


      travelDate: {
        allowNull: false,
        type: Sequelize.DATE
      },

      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Support');
  }
};
