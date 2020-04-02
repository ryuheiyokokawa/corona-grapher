import React from 'react'
import {VictoryChart, VictoryLine, VictoryAxis, VictoryLabel, VictoryVoronoiContainer, VictoryLegend} from 'victory'
import moment from 'moment'
import {Col, Row} from 'react-bootstrap'
import {lineColors} from '../graph-shared/colors'
import DateIndicator from '../graph-shared/date-indicator'


//Line Chart
function Chart({graphQuery, graphData,countryMap,provinceMap}) {
    let line_sources = []
    let legend_data = []
    
    //Each Country or Province
    graphData.map((location,i) => {
        line_sources[i] = []
        let dayCount = 0
        location.days.map((day,index) => {
            if(day.confirmed >= 1 || dayCount) {
                dayCount++
                let delta = 0
                if( dayCount >= 8 ) {
                    delta = day.confirmed - location.days[index-7].confirmed
                    if(delta > 1 && day.confirmed >= 10) {
                        let item = {
                            x: day.confirmed,
                            y: delta
                        }
                        line_sources[i].push(item)
                    }
                }
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
                <VictoryChart scale={{ x: 'log', y: 'log' }} >
                    <VictoryAxis 
                        label="Confirmed"
                        fixLabelOverlap={true} 
                        tickFormat={(x) => {
                        if(x >= 1000) {
                            return  x/1000 + 'K'
                        } else {
                            return x
                        }
                    }}/>
                    <VictoryAxis 
                        label="Confirmed Delta (7days)"
                        axisLabelComponent={<VictoryLabel dy={-12} />}
                        fixLabelOverlap={true} 
                        labelPlacement="vertical"
                        dependentAxis 
                        tickFormat={(y) => {
                        if(y >= 1000) {
                            return  y/1000 + 'K'
                        } else {
                            return y
                        }
                    }} />
                    
                    {graphData.map((location,i) => {
                        let stroke = lineColors[i]
                        return (
                            <VictoryLine 
                                style={{
                                    location_name: location.province_id ? provinceMap[location.province_id] : countryMap[location.country_id],
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
                <p style={{fontSize:'12px'}}>This graph type is a specific implementation I saw <a href="https://www.youtube.com/watch?v=54XLXg4fYsc" target="_blank">here</a>.  It shows whether or not COVID-19 is actually slowing down. Kudos to those guys for making this data relevant!</p>
                <DateIndicator startDate={graphQuery.variables.startDate} endDate={graphQuery.variables.endDate} />
                <VictoryLegend x={0} y={0}
                    width="100%"
                    height="50vh"
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