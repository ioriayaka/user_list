'use strict'
const bcrypt = require('bcryptjs')
const SEED_USER = {
  name: 'root',
  address: 'area-root',
  password: '12345678'
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: SEED_USER.name,
      address: SEED_USER.address,
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10), null),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
      .then(userId => queryInterface.bulkInsert('Customs',
        Array.from({ length: 10 }).map((_, i) =>
        ({
          name: `name-${i}`,
          address: `my area-${i}`,
          password: `${i}` + `${i}` ,
          UserId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {}))
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Customs', null, {})
      .then(() => queryInterface.bulkDelete('Users', null, {}))
  }
}
