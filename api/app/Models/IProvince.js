'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class IProvince extends Model {
    // static get connect() {
    //     return 'sqlite'
    // }
    country() {
        return this.hasOne('App/Models/ICountry','country_id','id')
    }
    days() {
        return this.hasMany('App/Models/IDay','id','province_id')
    }
}

module.exports = IProvince
