'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      note.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  note.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5,10]
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10,500]
      }
    },
  }, {
    sequelize,
    modelName: 'note',
  });
  return note;
};
