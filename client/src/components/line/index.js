import React, {useState} from 'react'
import Chart from './chart'
import { useQuery } from '@apollo/react-hooks';
import { COUNTRIES, PROVINCES } from '../../queries'


function LineGraph({locationData}) {
    const countries = locationData.countries
    const provinces = locationData.provinces
    const [graphdata,setGraphData] = useState(0)

    return (
        <div className="graph-wrapper">
            {graphdata ? (
                    <Chart graphdata={graphdata}/> 
                ):(
                    <div className="choose">Choose data below</div>
                )
            }
            <div className="controls-wrapper">

            </div>
        </div>
    )
}

export default LineGraph