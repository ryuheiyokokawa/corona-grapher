import { gql } from 'apollo-boost';

export const TYPEDEFS = gql`

    type Country {
        id: Int!
        name: String!
        lat: Float!
        long: Float!
        provinces: [Province]
    }

    type Province {
        id: Int!
        name: String!
        lat: Float!
        long: Float!
        country_id: Int!
        country: Country
    }

    type Day {
        id: Int!
        date: String!
        country_id: Int!
        province_id: Int!
        confirmed: Int!
        recovered: Int!
        deaths: Int!
        province: Province
        country: Country
    }

    type Graphs {
        graphs: [Graph]
    }

    type Graph {
        id: String!
        title: String!
        startDate: String!
        endDate: String
        graphType: GraphType
    }

    union GraphType =  Pie | Line | StackedBar | StackedArea

    type Affected {
        confirmed: Int!
        deaths: Int!
        recovered: Int!
    }

    type Pie {
        country: Country!
        province: Province
    }

    type Line {
        sources: [LineSources]
    }

        type LineSources {
            country: Country!
            province: Province
        }

    type StackedBar {
        sources: [StackedBarSources]
    }
        type StackedBarSources {
            country: Country!
            province: Province
        }

    type StackedArea {
        country: Country!
        province: Province
    }

    type Query {
        getAllGraphs: Graphs!
        getGraph: Graph!
    }

    type Mutation {
        storeNewGraph(graph: Graph!): String!
        deleteGraph(id: String!): String!
    }

`

export const GET_ALL_GRAPHS = gql`
    query getAllGraphs {
        getAllGraphs @client {
            graphs {
                id
                title
                startDate
                endDate
                graphType {
                    ... on Pie {
                        country
                        province
                    }
                    ... on Line {
                        sources {
                            country
                            province
                        }
                    }
                    ... on StackedBar {
                        sources {
                            country
                            province
                        }
                    }
                    ... on StackedArea {
                        country
                        province
                    }
                }
            }
        }
    }
`

export const GET_GRAPHS = gql`
    query {
        graphs @client
    }
`

export const STORE_NEW_GRAPH = gql`
    mutation storeNewGraph($graph: Graph!) {
        storeNewGraph(graph:$graph) @client
    }
`
