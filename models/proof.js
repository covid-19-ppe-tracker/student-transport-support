'use strict';

const proof_kinds = ['document', 'hyperlink', 'manual'];

module.exports = (sequelize, DataTypes) => {
  const Proof = sequelize.define('Proof', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    kind: {
      type: DataTypes.ENUM,
      values: proof_kinds,
      allowNull: false,
    },
    uri: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    }
  }, {
    tableName: 'proofs'
  });
  Proof.associate = function(models) {
    // associations can be defined here
  };
  return Proof;
};

