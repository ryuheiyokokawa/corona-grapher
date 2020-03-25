import {
    GET_GRAPHS
} from '../queries/client'


export const resolvers = {
    Query: {
        getAllGraphs: (_, variables, {cache}) => {
            return cache.readQuery({query:GET_GRAPHS})
        },
        getGraph: (_, variables, {cache}) => {
            //return cache.readQuery({query: })
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
