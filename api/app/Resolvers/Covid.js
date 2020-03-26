const moment = require('moment')
const ICountry = use ('App/Models/ICountry')
const IProvince = use ('App/Models/IProvince')
const IDay = use('App/Models/IDay')


module.exports = {
    Query: {
        
        //All data queries
        getCountries: async () => {
            const countries = await ICountry
            .query()
            .with('provinces')
            .with('days')
            .fetch()
            return countries.toJSON()
        },
        getProvinces: async (obj, args, context, info) => {
            const provincesQuery = IProvince
            .query()
            .with('country')
            .with('days')
            if(args.country_id) {
                provincesQuery.where('country_id',args.country_id)
            }
            
            const provinces = await provincesQuery.fetch()
            return provinces.toJSON()
        },
        getDays: async (obj, args, context, info) => {
            const daysQuery = await IDay
            .query()
            .with('country')
            .with('province')
            if(args.country_id) {
                daysQuery.where('country_id', args.country_id)
            }
            if(args.province_id) {
                daysQuery.where('province_id', args.province_id)
            }

            const days = daysQuery.fetch()
            
            return days.toJSON()
        },
        getGraphData: async (obj, args, context, info) => {
            // Country 
            let items = []
            
            await Promise.all(args.locations.map( async (location,i) => {
                const daysQuery = IDay
                .query()
                .with('country')
                .with('province')
                .where('date','>=', moment(args.startDate).format('YYYY-MM-DD'))//args.startDate
                .where('date','<=', moment(args.endDate).format('YYYY-MM-DD'))//args.endDate
                if(location.country_id) {
                    daysQuery.where('country_id', location.country_id)
                }
                if(location.province_id) {
                    daysQuery.where('province_id', location.province_id)
                }
                const days = await daysQuery.fetch()
                const days_json = days.toJSON()
                const days_keys = {}
                days_json.map((day,i) => {
                    if(typeof days_keys[day.date] == 'undefined') {
                        days_keys[day.date] = day
                    } else {
                        let current = days_keys[day.date]
                        days_keys[day.date].confirmed = current.confirmed + day.confirmed
                        days_keys[day.date].deaths = current.deaths + day.deaths
                        days_keys[day.date].recovered = current.recovered + day.recovered
                    }
                })
                location['days'] = Object.values(days_keys)
                items.push(location)
            }))
            return items

        }


        //Build the single lookups with where queries
    }
}