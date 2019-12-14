'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    authorId: DataTypes.INTEGER
  }, {});
  Book.associate = function (models) {
    // associations can be defined here
    Book.belongsTo(models.Author);
  };
  return Book;
};