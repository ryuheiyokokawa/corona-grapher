import { 
    GET_COUNTRIES_PROVINCES, 
    GET_COUNTRIES, 
    GET_PROVINCES,
    GET_GRAPHS,
} from '../queries/client'


export const resolvers = {
    Query: {
        getAllGraphs: (_, variables, {cache}) => {
            return cache.readQuery({query:GET_GRAPHS})
        },
        getGraph: (_, variables, {cache}) => {
            //return cache.readQuery({query: })
        },
        getCountries: (_, variables, {cache}) => {
            return cache.readQuery({query:GET_COUNTRIES})
        },
        getProvinces: (_, variables, {cache}) => {
            return cache.readQuery({query:GET_PROVINCES})
        }
    },
    Mutation: {
        storeNewGraph: (_, variables, {cache}) => {
            //return graph.id
        },
        deleteGraph: (_, variables, {cache}) => {
            // delete defaultSettings.graphs[graph.id]
            // return graph.id
        }
    }

}