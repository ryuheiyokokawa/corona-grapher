"use strict";
//Adonis
const { Command } = require("@adonisjs/ace");
const Env = use("Env");
const ICountry = use ('App/Models/ICountry')
const IProvince = use ('App/Models/IProvince')
const IDay = use ('App/Models/IDay')

//Node
const csvtojson = require("csvtojson");
const request = require('request')
const moment = require('moment')


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
    return "Processes the latest covid 19 data into SQLITE before copying into MySQL";
  }

  async handle(args, options) {
    this.info("Starting");
    this.countries = {}
    this.provinces = {}
    this.days = {}
    this._csvToJsonAll()
    .then(this._jsonToSqlAll.bind(this))
    .then(() => {
      console.log('all done!')
    })
    .catch(e => {
      //bad news bears
      console.log(e);
    });
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

      Promise.all(storage_promises)
      .then(resolve)
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

      Promise.all(storage_promises)
      .then(resolve)
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
      this._saveDays(days_to_insert)
      .then(resolve)
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
