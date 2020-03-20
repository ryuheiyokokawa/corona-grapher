'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ICountrySchema extends Schema {
  up () {
    this.create('i_countries', (table) => {
      table.increments()
      table.string('name')
      table.string('lat')
      table.string('long')
      table.timestamps()
    })
  }

  down () {
    this.drop('i_countries')
  }
}

module.exports = ICountrySchema
