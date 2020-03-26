import React from 'react'
import {VictoryChart, VictoryLine, VictoryAxis, VictoryLegend} from 'victory'
import moment from 'moment'
import {lineColors} from '../graph-shared/colors'

function Chart({graphData,countryMap,provinceMap}) {
    let line_sources = []
    let legend_data = []
    graphData.map((location,i) => {
        console.log(location)
        line_sources[i] = location.days.map((day,i) => {
            return {
                x: new Date(parseInt(day.date)),
                y: day.confirmed
            }
        });
        let location_name = location.province_id ? provinceMap[location.province_id] : countryMap[location.country_id]
        legend_data[i] = {
            name: location_name,
            symbol: {
                fill: lineColors[i]
            }
        }
    })
    return (
        <VictoryChart scale={{ x: 'time' }}>
            <VictoryAxis fixLabelOverlap={true} tickFormat={(t) => {
                return moment(t).format('MM/DD/YYYY')
            }}/>
            <VictoryAxis dependentAxis
                tickFormat={(x) => (x)}
            />
            <VictoryLegend x={50} y={50}
                title="Legend"
                centerTitle
                orientation="vertical"
                gutter={20}
                style={{ border: { stroke: "black" }, title: {fontSize: 10 } }}
                data={legend_data}
            />
            {graphData.map((location,i) => {
                let stroke = lineColors[i]
                return (
                    <VictoryLine 
                        style={{
                            data: { stroke: stroke },
                            parent: { border: "1px solid #ccc"}
                        }}
                        key={i} 
                        data={line_sources[i]} />
                )
            })}
        </VictoryChart>
    )
}

export default Chart