import React from 'react'
import {VictoryPie, VictoryLegend} from 'victory'
import {Col, Row} from 'react-bootstrap'
import {lineColors} from '../graph-shared/colors'
import DateIndicator from '../graph-shared/date-indicator'


function Chart({graphQuery,graphData,country,province}) {
    let location = graphData[0]
    let plot_data = {deaths: 0, confirmed:0, recovered: 0}
    location.days.map((day,i) => {
        plot_data.deaths = plot_data.deaths + day.deaths
        plot_data.confirmed = plot_data.confirmed + day.confirmed
        plot_data.recovered = plot_data.recovered + day.recovered
        return null
    })
    let legend_data = []
    let plot_array = Object.keys(plot_data).map((key,i) => {
        legend_data[i] = {
            name: `${key} - ${plot_data[key]}`,
            symbol: {
                fill: lineColors[i]
            }
        }
        return {x: key, y: plot_data[key]}
    })

    return (
        <Row>
            <Col sm="10">
                <VictoryPie
                    colorScale={lineColors}
                    data={plot_array}
                />
            </Col>
            <Col sm="2">
                <DateIndicator startDate={graphQuery.variables.startDate} endDate={graphQuery.variables.endDate} />
                <VictoryLegend
                    width="100%"
                    height="100%"
                    title="Stats"
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