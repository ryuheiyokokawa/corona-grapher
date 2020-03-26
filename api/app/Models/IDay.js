'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class IDay extends Model {
    // static get connect() {
    //     return 'sqlite'
    // }

    country() {
        return this.hasOne('App/Models/ICountry','country_id','id')
    }

    province() {
        return this.hasOne('App/Models/IProvince','province_id','id')
    }

}

module.exports = IDay
