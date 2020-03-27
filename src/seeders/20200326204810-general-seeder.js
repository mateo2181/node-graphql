'use strict';

let faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    let i = 0;
    let authors = [];
    while (i < 200) {
      authors.push({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        description: '',
        image: '',
        nationality: faker.address.country(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      i++;
    }
    return queryInterface.bulkInsert('Authors', authors, {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
