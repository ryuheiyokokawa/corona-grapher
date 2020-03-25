import {
    GET_GRAPHS
} from '../queries/client'


export const resolvers = {
    Query: {
        getAllGraphs: (_, variables, {cache}) => {
            try {
                let data = cache.readQuery({query:GET_GRAPHS})
                return data.graphs
            } catch(e) {
                return []
            }
        },
        getGraph: (_, variables, {cache}) => {
            //return cache.readQuery({query: })
        }
    },
    Mutation: {
        storeNewGraph: (_, variables, {cache}) => {
            const newGraph = variables.graph
            try {
                let data = cache.readQuery({query: GET_GRAPHS})
                let newGraphs = [
                    ...data.graphs,
                    newGraph
                ]
                //cache.writeData({data: {graphs: newGraphs} })
                cache.writeQuery({query: GET_GRAPHS, data: {graphs: newGraphs}})
                return null
            } catch(e) {
                console.log(e)
                return false
            }
            
        },
        deleteGraph: (_, variables, {cache}) => {
            // delete defaultSettings.graphs[graph.id]
            // return graph.id
        }
    }

}
