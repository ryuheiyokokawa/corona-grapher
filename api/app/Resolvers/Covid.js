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
        getProvinces: async () => {
            const provinces = await IProvince
            .query()
            .with('country')
            .with('days')
            .fetch()
            return provinces.toJSON()
        },
        getDays: async () => {
            const days = await IDay
            .query()
            .with('country')
            .with('province')
            .fetch()
            
            return days.toJSON()
        }

        //Build the single lookups with where queries
    }
}