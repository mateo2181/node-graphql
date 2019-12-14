'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    nationality: DataTypes.STRING
  }, {});
  Author.associate = function(models) {
    // associations can be defined here
    Author.hasMany(models.Book);
  };
  return Author;
};