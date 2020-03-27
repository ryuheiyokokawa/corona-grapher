import React from 'react'
import {VictoryChart, VictoryBar, VictoryStack, VictoryGroup, VictoryAxis, VictoryLegend} from 'victory'
import moment from 'moment'
import {Col, Row} from 'react-bootstrap'
import {colorScales} from '../graph-shared/colors'
import DateIndicator from '../graph-shared/date-indicator'

const affectedTypes = [
    'confirmed',
    'deaths',
    'recovered',
]

//Stacked Bar Chart
function Chart({graphQuery, graphData,countryMap,provinceMap}) {
    let location_sources = []
    let legend_data = []
    location_sources = graphData.map((location,i) => {
        let location_name = location.province_id ? provinceMap[location.province_id] : countryMap[location.country_id]
        legend_data[i] = {
            name: location_name,
            symbol: {
                fill: colorScales[i]
            }
        }
        
        return affectedTypes.map((type,i) => {
            return location.days.map((day,i) => {
                return {
                    x: new Date(parseInt(day.date)),
                    y: day[type]
                }
            });
        })
    })
    return (
        <Row>
            <Col sm="10" >
                <VictoryChart domainPadding={{ x: 50 }} scale={{ x: 'time' }}>
                    <VictoryAxis fixLabelOverlap={true} tickFormat={(t) => {
                        return moment(t).format('MM/DD/YYYY')
                    }}/>
                    <VictoryAxis dependentAxis tickFormat={(x) => (x)} />
                    
                    <VictoryGroup offset={20} style={{ data: { width: 15 } }}>
                        {location_sources.map((stacks,i) => {
                            let colorScale = colorScales[i]
                            return (
                                <VictoryStack colorScale={colorScale} key={i}>
                                    {stacks.map((data,index) => {
                                        return (<VictoryBar key={index} data={data} />)
                                    })}
                                </VictoryStack>
                            )
                        })}
                    </VictoryGroup>
                </VictoryChart>
            </Col>
            <Col sm="2">
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