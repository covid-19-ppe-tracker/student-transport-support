'use strict';

const documentKinds = ['file', 'hyperlink'];

module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    kind: {
      type: DataTypes.ENUM,
      values: documentKinds,
    },
    uri: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    }
  });
  Document.associate = function (models) {
    // associations can be defined here
    Document.belongsTo(models.Proof, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Document;
};

