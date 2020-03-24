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
        name: String!
        graphType: GraphType
    }

    union GraphType =  Pie | Line | StackedBar | StackedArea

    type Affected {
        confirmed: Int!
        deaths: Int!
        recovered: Int!
    }

    type Pie {
        affected: Affected
        country: String!
        province: String
        startDate: String!
        endDate: String
    }

    type Line {
        startDate: String!
        endDate: String!
        sources: [LineSources]
    }

        type LineSources {
            affected: Affected
            country: String!
            province: String
        }

    type StackedBar {
        startDate: String!
        endDate: String
        sources: [StackedBarSources]
    }
        type StackedBarSources {
            affected: Affected
            country: String!
            province: String
        }

    type StackedArea {
        affected: Affected
        country: String!
        province: String
        startDate: String!
        endDate: String!
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
                name
                graphType {
                    ... on Pie {
                        affected {
                            confirmed
                            deaths
                            recovered
                        }
                        country
                        province
                        startDate
                        endDate
                    }
                    ... on Line {
                        startDate
                        endDate
                        sources {
                            affected {
                                confirmed
                                deaths
                                recovered
                            }
                            country
                            province
                        }
                    }
                    ... on StackedBar {
                        startDate
                        endDate
                        sources {
                            affected {
                                confirmed
                                deaths
                                recovered
                            }
                            country
                            province
                        }
                    }
                    ... on StackedArea {
                        affected {
                            confirmed
                            deaths
                            recovered
                        }
                        country
                        province
                        startDate
                        endDate
                    }
                }
            }
        }
    }
`

export const GET_COUNTRIES_PROVINCES = gql`
    query getCountriesProvinces {
        countries @client {
            id
            name
        }
        provinces @client {
            id
            name
        }
    }
`

export const GET_COUNTRIES = gql`
    query getCountries {
        countries @client {
            id
            name
        }
    }
`

export const GET_PROVINCES = gql`
    query getProvinces {
        provinces @client {
            id
            name
        }
    }
`

export const GET_GRAPHS = gql`
    query getGraphs {
        graphs @client
    }
`

export const STORE_COUNTRIES_PROVINCES = gql`
    mutation storeCountriesProvinces($countries: [Country], $provinces: [Province]) {
        storeCountriesProvinces(countries:$countries, provinces: $provinces) @client
    }
`

export const STORE_NEW_GRAPH = gql`
    mutation storeNewGraph($graph: Graph!) {
        storeNewGraph(graph:$graph) @client
    }
`

