'use strict';
var faker = require('faker');
const env = process.env.NODE_ENV || 'development';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    if(env==='production'){
      // We don't want to seed this in production
      return;
    }
    let locations = [];
    for(let i = 1; i <= 11;i++){
      locations.push({
        id:i,
        name: faker.address.state(),
        isLocatedInId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    await queryInterface.bulkInsert('Locations', locations);
    locations = [];
    for(let i = 12; i <= 100;i++){
      locations.push({
        id:i,
        name: faker.address.city(),
        isLocatedInId: parseInt(Math.random()*10)+1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('Locations', locations);

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Locations', null, {});
  }
};
