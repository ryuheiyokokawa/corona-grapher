"use strict";
//Adonis
const { Command } = require("@adonisjs/ace");
const Env = use("Env");
const Config = use('Config')
const ICountry = use ('App/Models/ICountry')
const IProvince = use ('App/Models/IProvince')
const IDay = use ('App/Models/IDay')

//Node
const csvtojson = require("csvtojson");
const request = require('request')
const moment = require('moment')
const knex = require('knex')(Config.get('database.mysql'))//Want raw access at this point.


//Constants
const git_url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/'
const git_files = {
  confirmed:
    "csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv",
  deaths:
    "csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv",
  recovered:
    "csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv"
};
const data_types = [
  'confirmed', 'deaths', 'recovered'
]


class Process extends Command {
  static get signature() {
    return "process";
  }

  static get description() {
    return "Processes the latest COVID-19 data into MySQL";
  }

  async handle(args, options) {
    await this._init()
  }
  _init() {
    return new Promise((resolve,reject) => {
      this.info("Starting data injestion from John's Hopkin's Github account");
      this.countries = {}
      this.provinces = {}
      this.days = {}
      this._emptyTables()
      .then(this._csvToJsonAll.bind(this))
      .then(this._jsonToSqlAll.bind(this))
      .then(() => {
        this.success('All done! You can Ctrl+C now.')// I have yet to figure out how to disconnect the knex instance within Lucid
        resolve()
      })
      .catch(e => {
        //bad news bears
        console.log(e);
        reject(e)
      });
    })
  }
  _emptyTables() {
    return new Promise((resolve,reject) => {
      let tables = [
        'i_days',
        'i_provinces',
        'i_countries'
      ]
      //Gotta delete the table data
      let promises = []
      tables.forEach((table,i) => {
        promises[i] = knex(table).del()
      })
      //Gotta reset the increment
      tables.forEach((table,i) => {
        let counter = i + tables.length
        promises[counter] = knex.raw(`ALTER TABLE ${table} AUTO_INCREMENT = 1`)
      })
      Promise.all(promises)
      .then(() => {
        knex.destroy()
        resolve()
      })
      .catch(reject)
    })
  }
    
  _csvToJsonAll() {
    return new Promise((resolve, reject) => {
      let promises = []
      data_types.forEach((type,i) => {
        promises[i] = this._csvToJson(type)
      })
      Promise.all(promises)
      .then(resolve)
      .catch(reject)
    })
  }
  _csvToJson(type) {
    return new Promise((resolve, reject) => {
      csvtojson()
        .fromStream(request.get(git_url + git_files[type]))
        .then(csvRow => {
          this[type + "_json"] = csvRow;
          this.info(`Finished retrieving and converting ${type} csv data into json`)
          resolve()
        })
        .catch(reject)
    })
  }
  _jsonToSqlAll() {
    return new Promise((resolve, reject) => {
      this._storeCountries()
      .then(this._storeProvinces.bind(this))
      .then(this._storeDays.bind(this))
      .then(() => {
        this.info('Finished storing all json data')
        resolve()
      })
      .catch(reject)
    })
  }

  _storeCountries() {
    return new Promise((resolve,reject) => {
      data_types.forEach((type,i) => {
        this[type + "_json"].forEach((data,i) => {
          let country = data['Country/Region']
          this.countries[country] = {//by using key value pair, its unique from the start.
            id: 0,
            name: country,
            lat: data['Lat'],
            long: data['Long'],
          }
          
        })
      })
      
      let storage_promises = []
      //build storage promise
      let counter = 0;
      for(let country in this.countries) {
        storage_promises[counter] = this._saveCountry(this.countries[country])
        counter++;
      }
      this.info('Number of Countries: ' + storage_promises.length)

      Promise.all(storage_promises)
      .then(() => {
        this.info('Finished inserting all countries')
        resolve()
      })
      .catch(reject)
    })
  }

  async _saveCountry(location) {
    let country = new ICountry()
    country.name = location.name
    country.lat = location.lat
    country.long = location.long
    await country.save()
    this.countries[location.name].id = country.id
    return
  }

  _storeProvinces() {
    return new Promise((resolve,reject) => {
      data_types.forEach((type,i) => {
        this[type + "_json"].forEach((data,i) => {
          let country = data['Country/Region']
          let province = data['Province/State']
          if(province) {
            this.provinces[province] = {//by using key value pair, its unique from the start.
              id: 0,
              name: province,
              country_name: country,
              country_data: this.countries[country],
              lat: data['Lat'],
              long: data['Long'],
            }
          }
          
        })
      })
      let storage_promises = []
      let counter = 0
      for(let province in this.provinces) {
        storage_promises[counter] = this._saveProvince(this.provinces[province])
        counter++
      }
      this.info('Number of Provinces: ' + storage_promises.length)

      Promise.all(storage_promises)
      .then(() => {
        this.info('Finished inserting all provinces')
        resolve()
      })
      .catch(reject)

    })
  }

  async _saveProvince(location) {
    let province = new IProvince()
    province.name = location.name
    province.country_id = location.country_data.id
    province.lat = location.lat
    province.long = location.long
    await province.save()
    this.provinces[location.name].id = province.id
  }

  _storeDays() {
    return new Promise((resolve,reject) => {
      data_types.forEach((type,i) => {
        this[type + "_json"].forEach((data,i) => {
          let country = data['Country/Region']
          let province = data['Province/State']
          
          //some have no provincial data.
          let unique_header = province ? `${this.countries[country].id}-${this.provinces[province].id}` : `${this.countries[country].id}`
           
          let days_only = data
          delete days_only['Country/Region']
          delete days_only['Province/State']
          delete days_only['Lat']
          delete days_only['Long']
          
          for(let date in days_only) {
            let affected = days_only[date]
            if(typeof this.days[`${unique_header}-${date}`] == 'undefined') {
              this.days[`${unique_header}-${date}`] = {
                country_id: this.countries[country].id,
                province_id: province ? this.provinces[province].id : 0,
                date: moment(date,'M/D/YYYY').format('YYYY-MM-DD')
              }
            }
            this.days[`${unique_header}-${date}`][type] = affected
          }

        })
      })
      let days_to_insert = []
      let counter = 0;
      for(let key in this.days) {
        days_to_insert[counter] = this.days[key]
        counter++;
      }

      this.info('Number of Unique Days-Provinces/Countries: ' + days_to_insert.length)

      this._saveDays(days_to_insert)
      .then( () => {
        this.info('Finished inserting all days')
        resolve()
      })
      .catch(reject)

    })
  }

  async _saveDays(days_to_insert) {
    //Hopefully use the createMany method
    await IDay.createMany(days_to_insert)
    return
  }

}

module.exports = Process;
