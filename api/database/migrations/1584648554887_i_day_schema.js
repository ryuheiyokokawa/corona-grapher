'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IDaySchema extends Schema {
  up () {
    this.create('i_days', (table) => {
      table.increments()
      table.date('date')
      table.integer('country_id')
      table.integer('province_id')
      table.bigInteger('confirmed')
      table.bigInteger('deaths')
      table.bigInteger('recovered')
      table.integer('days')
      table.timestamps()
    })
  }

  down () {
    this.drop('i_days')
  }
}

module.exports = IDaySchema
