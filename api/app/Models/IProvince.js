'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class IProvince extends Model {
    // static get connect() {
    //     return 'sqlite'
    // }
    country() {
        return this.belongsTo('App/Models/ICountry')
    }
    days() {
        return this.hasMany('App/Models/IDay')
    }
}

module.exports = IProvince