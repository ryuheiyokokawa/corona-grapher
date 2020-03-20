'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class IDay extends Model {
    // static get connect() {
    //     return 'sqlite'
    // }

    country() {
        return this.belongsTo('App/Models/ICountry','country_id')
    }

    province() {
        return this.belongsTo('App/Models/IProvince','province_id')
    }

}

module.exports = IDay
