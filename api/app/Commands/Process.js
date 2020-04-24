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
  confirmed:"csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
  deaths: "csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
  recovered: "csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv",
  confirmed_us:"csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv",
  deaths_us:"csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
};
const data_types = [
  'confirmed', 
  'deaths', 
  'recovered'
]

const us_states_types = [
  'confirmed_us',
  'deaths_us'
]

const all_data_types = data_types.concat(us_states_types)


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
      this.info("Starting data injestion from Johns Hopkins Github account");
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
      all_data_types.forEach((type,i) => {
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
      all_data_types.forEach((type,i) => {
        this[type + "_json"].forEach((data,i) => {
          if( data_types.includes(type) ) {//If we're pulling from global data
            let country = data['Country/Region']
            let province = data['Province/State']
            if(province) {
              this.provinces[province] = {//by using key value pair, its unique from the start.
                id: 0,
                name: province,
                country_name: country,
                country_data: this.countries[country],
                lat: parseFloat(data['Lat']) ? data['Lat'] : 0,
                long: parseFloat(data['Long']) ? data['Long'] : 0,
              }
            }
          } else if(us_states_types.includes(type)) { //If we're pulling from US states data
            let country = 'US'
            let province = data['Province_State']
            if(province) {
              this.provinces[province] = {
                id:0,
                name: province,
                country_name: country,
                country_data: this.countries[country],
                lat: parseFloat(data['Lat']) ? data['Lat'] : 0,
                long: parseFloat(data['Long_']) ? data['Long_'] : 0
              }
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
      all_data_types.forEach((type,i) => {
        this[type + "_json"].forEach((data,i) => {

          let days_only = data
          let country, province

          if(data_types.includes(type)) {
            country = data['Country/Region']
            province = data['Province/State']
            delete days_only['Country/Region']
            delete days_only['Province/State']
            delete days_only['Lat']
            delete days_only['Long']
          } else if(us_states_types.includes(type)) {
            country = 'US'
            province = data['Province_State']
            let delete_array = ['UID','iso2','iso3','code3','FIPS','Admin2','Province_State','Country_Region','Lat','Long_','Combined_Key']
            for (let index = 0; index < delete_array.length; index++) {
              delete days_only[delete_array[index]]
            }
            if(type === 'deaths_us') {
              delete days_only['Population']//WTF!
            }
          }

          if(country === 'US' && province.length === 0) {
            //Do nothing
            //console.log(country,province)
          } else{
            let unique_header = province ? `${this.countries[country].id}-${this.provinces[province].id}` : `${this.countries[country].id}`
            //Process the days_only
            for(let date in days_only) {
              let affected = !days_only[date] ? 0 : days_only[date] //Had an issue where the data has nothing in it.
              if(typeof this.days[`${unique_header}-${date}`] == 'undefined') {
                this.days[`${unique_header}-${date}`] = {
                  country_id: this.countries[country].id,
                  province_id: province ? this.provinces[province].id : 0,
                  date: moment(date,'M/D/YYYY').format('YYYY-MM-DD')
                }
              }

              //For the states data since each row is by county (a detail level that we currently do not support)
              if(
                typeof this.days[`${unique_header}-${date}`] != 'undefined' &&
                typeof this.days[`${unique_header}-${date}`][ type.split('_')[0] ] != 'undefined'  
                ) {
                  let pastAffected = parseInt(this.days[`${unique_header}-${date}`][ type.split('_')[0] ])
                  this.days[`${unique_header}-${date}`][ type.split('_')[0] ] = parseInt(affected) + pastAffected
              } else {
                this.days[`${unique_header}-${date}`][ type.split('_')[0] ] = parseInt(affected)
              }
            }//end of date-key builder

          }//end of us data exclusion from global report

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
    await IDay.createMany(days_to_insert)
    return
  }

}

module.exports = Process;
