'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: DataTypes.STRING
  }, {});
  Location.associate = function(models) {
    // associations can be defined here
    Location.belongsTo(models.Location, {
      as: "isLocatedIn",
      onDelete: "SET NULL",
      foreignKey: {
        allowNull: true
      }
    });
  };
  return Location;
};
