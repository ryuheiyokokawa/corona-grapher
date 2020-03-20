'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IProvinceSchema extends Schema {
  up () {
    this.create('i_provinces', (table) => {
      table.increments()
      table.integer('country_id')
      table.string('name')
      table.string('lat')
      table.string('long')
      table.timestamps()
    })
  }

  down () {
    this.drop('i_provinces')
  }
}

module.exports = IProvinceSchema
