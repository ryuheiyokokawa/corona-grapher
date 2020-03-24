import React from 'react'
import {VictoryChart, VictoryLine} from 'victory'

function Chart({graphdata}) {
    return (
        <VictoryChart>
            <VictoryLine data={graphdata}/>
        </VictoryChart>
    )
}

export default Chart