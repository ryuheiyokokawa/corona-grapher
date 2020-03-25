const ICountry = use ('App/Models/ICountry')
const IProvince = use ('App/Models/IProvince')
const IDay = use ('App/Models/IDay')

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
        }

        //Build the single lookups with where queries
    }
}