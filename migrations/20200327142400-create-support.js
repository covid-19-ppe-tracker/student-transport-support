'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Supports', {
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

      sourceId: {
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        allowNull: false,
        references: {
          model: 'Locations',
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

      destinationId: {
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        allowNull: false,
        references: {
          model: 'Locations',
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

      resolved: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('Supports');
  }
};
