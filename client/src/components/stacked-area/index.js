import React from 'react'
import Chart from './chart'
import { useQuery } from '@apollo/react-hooks';
import {GET_GRAPH_DATA} from '../../queries/index'


//Stacked Area is single source only
function StackedAreaGraph({graph}) {
    let graphLocations = []
    const {graphType} = graph
    let country = graphType.country
    let province

    graphLocations[0] = {country_id: country.id}
    
    if(graphType.province) {
        province = graphType.province
        graphLocations[0]['province_id'] = province.id
    }

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
                    <Chart graphQuery={query_vars} graphData={data.graphData} country={country} province={province} /> 
                ):(
                    <div className="loading">Loading</div>
                )
            }
        </div>
    )
}

export default StackedAreaGraph