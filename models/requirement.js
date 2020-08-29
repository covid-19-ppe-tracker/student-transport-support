'use strict';
module.exports = (sequelize, DataTypes) => {
  const Requirement = sequelize.define('Requirement', {
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
  Requirement.associate = function(models) {
    // associations can be defined here
    Requirement.belongsTo(models.Location, {
      as: "source",
      onDelete: "SET NULL",
      foreignKey: {
        allowNull: true
      }
    });
    Requirement.belongsTo(models.Location, {
      as: "destination",
      onDelete: "SET NULL",
      foreignKey: {
        allowNull: true
      }
    });
  };
  return Requirement;
};
