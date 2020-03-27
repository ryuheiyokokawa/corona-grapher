import React from 'react'
import {VictoryChart, VictoryLine, VictoryAxis, VictoryLegend} from 'victory'
import moment from 'moment'
import {Col, Row} from 'react-bootstrap'
import {lineColors} from '../graph-shared/colors'
import DateIndicator from '../graph-shared/date-indicator'


//Line Chart
function Chart({graphQuery, graphData,countryMap,provinceMap}) {
    let line_sources = []
    let legend_data = []
    graphData.map((location,i) => {
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
        return null
    })
    return (
        <Row>
            <Col sm="10" >
                <VictoryChart scale={{ x: 'time' }}>
                    <VictoryAxis fixLabelOverlap={true} tickFormat={(t) => {
                        return moment(t).format('MM/DD/YYYY')
                    }}/>
                    <VictoryAxis dependentAxis tickFormat={(x) => (x)} />
                    
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
            </Col>
            <Col sm="2">
                <DateIndicator startDate={graphQuery.variables.startDate} endDate={graphQuery.variables.endDate} />
                <VictoryLegend x={0} y={0}
                    width="100%"
                    height="100%"
                    title="Confirmed"
                    centerTitle
                    orientation="vertical"
                    gutter={20}
                    style={{ border: { stroke: "black" }, title: {fontSize: 10 } }}
                    data={legend_data}
                />
                
                
            </Col>
        </Row>
    )
}

export default Chart