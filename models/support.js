'use strict';
module.exports = (sequelize, DataTypes) => {
  const Support = sequelize.define('Support', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    contact: DataTypes.STRING,
    sourceLatitude: DataTypes.DOUBLE,
    sourceLongitude: DataTypes.DOUBLE,

    destinationLatitude: DataTypes.DOUBLE,
    destinationLongitude: DataTypes.DOUBLE,
    resolved: DataTypes.BOOLEAN,
    travelDate: DataTypes.DATE,
    remarks: DataTypes.TEXT,
  }, {});
  Support.associate = function (models) {
    // associations can be defined here
    Support.belongsTo(models.Location, {
      as: "source",
      onDelete: "SET NULL",
      foreignKey: {
        allowNull: true
      }
    });
    Support.belongsTo(models.Location, {
      as: "destination",
      onDelete: "SET NULL",
      foreignKey: {
        allowNull: true
      }
    });
  };
  return Support;
};
