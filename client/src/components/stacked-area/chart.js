import React from 'react'
import {VictoryChart, VictoryStack, VictoryArea, VictoryAxis, VictoryVoronoiContainer, VictoryLegend} from 'victory'
import moment from 'moment'
import {Col, Row} from 'react-bootstrap'
import {lineColors} from '../graph-shared/colors'
import DateIndicator from '../graph-shared/date-indicator'

//Stacked Area Chart
function Chart({graphQuery, graphData,countryMap,provinceMap}) {
    let location = graphData[0]
    let confirmed = []
    let deaths = []
    let recovered = []

    location.days.map((day,i) => {
        confirmed[i] = {x: new Date(parseInt(day.date)), y: day.confirmed }
        deaths[i] = {x: new Date(parseInt(day.date)), y: day.deaths }
        recovered[i] = {x: new Date(parseInt(day.date)), y: day.recovered }
        return null
    })

    
    const legend_data = [
        {
            name: 'Confirmed',
            symbol: {
                fill: lineColors[2]
            }
        },
        {
            name: 'Deaths',
            symbol: {
                fill: lineColors[1]
            }
        },
        {
            name: 'Recovered',
            symbol: {
                fill: lineColors[0]
            }
        }
    ]

    return (
        <Row>
            <Col sm="10">
                <VictoryChart>
                    <VictoryAxis fixLabelOverlap={true} tickFormat={(t) => {
                        return moment(t).format('MM/DD/YYYY')
                    }}/>
                    <VictoryAxis dependentAxis tickFormat={(x) => (x)}/>
                    <VictoryStack colorScale={lineColors}>
                        <VictoryArea data={recovered} />
                        <VictoryArea data={deaths}/>
                        <VictoryArea data={confirmed}/>
                    </VictoryStack>
                </VictoryChart>
            </Col>
            <Col sm="2">
                <DateIndicator startDate={graphQuery.variables.startDate} endDate={graphQuery.variables.endDate} />
                <VictoryLegend
                    x={0} y={0}
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