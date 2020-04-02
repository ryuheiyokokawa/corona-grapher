import React from 'react'
import Chart from './chart'
import { useQuery } from '@apollo/react-hooks';
import {GET_GRAPH_DATA} from '../../queries/index'

function StackedBarGraph({graph}) {
    let graphLocations = []
    let countryMap = {}
    let provinceMap = {}

    graph.graphType.sources.map((location,i) => {
        graphLocations[i] = {
            country_id:location.country.id
        }
        countryMap[location.country.id] = location.country.name
        if(location.province) {
            graphLocations[i]['province_id'] = location.province.id
            provinceMap[location.province.id] = location.province.name
        }
    })

    let query_vars = {
        variables: {
            locations: graphLocations,
            startDate: graph.startDate,
            endDate: graph.endDate
        }
    }

    //TODO: Might add error/loading catch later.
    const {data} = useQuery(GET_GRAPH_DATA, query_vars)
    
    return (
        <div className="graph-wrapper">
            {data && data.graphData ? (
                    <Chart graphQuery={query_vars} graphData={data.graphData} countryMap={countryMap} provinceMap={provinceMap} /> 
                ):(
                    <div className="loading">Loading</div>
                )
            }
        </div>
    )
}

export default StackedBarGraph