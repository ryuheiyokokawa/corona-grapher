import { gql } from 'apollo-boost';

// Simply get list of countries
export const COUNTRIES = gql`
    query {
        countries: getCountries {
            id
            name
            lat
            long
        }
    }
`

// Get Provinces and their country name
export const PROVINCES = gql`
    query {
        provinces: getProvinces {
            id
            country_id
            country {
                id
                name
            }
            name
            lat
            long
        }
    }
`

export const PROVINCES_FOR_COUTNRY = gql`
    query provinces($country_id: ID!) {
        provinces: getProvinces(country_id: $country_id) {
            id
            country_id
            country {
                id
                name
            }
            name
            lat
            long
        }
    }
`

// Get both in one go.
export const COUNTRIES_AND_PROVINCES = gql`
    query {
        countries: getCountries {
                id
                name
                lat
                long
                provinces {
                    id
                    name
                }
            }
        provinces: getProvinces {
            id
            country_id
            country {
                id
                name
            }
            name
            lat
            long
        }
    }
`

export const GET_GRAPH_DATA = gql`
    query graphData($locations:[GraphQueryLocation]!, $startDate:String!, $endDate:String) {
        graphData: getGraphData(locations: $locations, startDate: $startDate, endDate: $endDate) {
            country_id
            province_id
            country {
                id
                name
            }
            province {
                id
                name
            }
            days {
                date
                confirmed
                deaths
                recovered
            }
        }
    }
`