import React, {useState} from 'react'
import Form from 'react-bootstrap/Form'
import {VictoryChart, VictoryLine, VictoryAxis, VictoryLabel, VictoryVoronoiContainer, VictoryLegend} from 'victory'
import moment from 'moment'
import {Col, Row} from 'react-bootstrap'
import {lineColors} from '../graph-shared/colors'
import DateIndicator from '../graph-shared/date-indicator'


//Line Chart
function Chart({graphQuery, graphData,countryMap,provinceMap}) {
    const [scale, setScale] = useState('linear')

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
                <VictoryChart 
                    scale={{ x: 'time', y: scale }} 
                    containerComponent={
                    <VictoryVoronoiContainer
                        mouseFollowTooltips
                        voronoiDimension="x"
                        title="Confirmed"
                        labels={({datum}) => {
                            return `${datum.style.location_name}: ${datum.y}`
                        }}
                        />
                    }
                    >
                    <VictoryAxis 
                        label="Days"
                        fixLabelOverlap={true} 
                        tickFormat={(t) => {
                        return moment(t).format('MM/DD/YYYY')
                    }}/>
                    <VictoryAxis 
                        label={() => {
                            return scale == 'linear' ? 'Confirmed' :'Confirmed (log)'
                        }}
                        axisLabelComponent={<VictoryLabel dy={-12} />}
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
                <Row>
                    <Col>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Enable Log" onChange={()=> { scale == 'linear' ? setScale('log'): setScale('linear') }} />
                        </Form.Group>
                    </Col>
                    <Col>
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
                
            </Col>
        </Row>
    )
}

export default Chart