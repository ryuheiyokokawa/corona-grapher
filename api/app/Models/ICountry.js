'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ICountry extends Model {
    // static get connect() {
    //     return 'sqlite'
    // }
    provinces() {
        return this.hasMany('App/Models/IProvince')
    }
    days() {
        return this.hasMany('App/Models/IDay')
    }
}

module.exports = ICountry
