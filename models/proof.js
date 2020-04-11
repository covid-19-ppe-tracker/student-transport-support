'use strict';
module.exports = (sequelize, DataTypes) => {
  const Proof = sequelize.define('Proof', {
    verified: DataTypes.BOOLEAN
  }, {});
  Proof.associate = function (models) {
    // associations can be defined here
    Proof.hasMany(models.Document, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Proof;
};
