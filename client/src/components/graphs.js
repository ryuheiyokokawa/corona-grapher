import React from 'react';
import {
  Switch,
  Route,
  Link,
  useParams,
  Redirect
} from "react-router-dom";
import {Col, Row, Container} from 'react-bootstrap'
import { useQuery } from '@apollo/react-hooks';
import { GET_GRAPHS } from '../queries/client'

import LineGraph from './line'
import PieGraph from './pie'
import StackedBarGraph from './stacked-bar'
import StackedAreaGraph from './stacked-area'

const graphTypes = {
  line: {
    name: 'line',
    component: LineGraph
  },
  pie: {
    name: 'pie',
    component: PieGraph
  },
  "stacked-bar": {
    name: 'stacked-bar',
    component: StackedBarGraph
  },
  "stakced-area": {
    name: 'stacked-area',
    component: StackedAreaGraph
  }
}

function Graphs() {
  const { data } = useQuery(GET_GRAPHS)
  let graphs
  if(data.graphs.length) {
    graphs = data.graphs
  } else {
    return (<Redirect to="/"/>)
  }
  
  const graphsByKey = {}
  graphs.map((graph,i) => {
    graphsByKey[graph.id] = graph
  })

  return (
      <div className="graphs-wrapper">
        <Container>
          <Row>
            <Col>
              <ul className="nav">
                {graphs.map((graph,i) => {
                  return (
                    <li key={i} className="nav-item">
                      <Link className="nav-link" to={`/graphs/${graph.id}`} >{graph.title}</Link>
                    </li>
                  )
                })}
              </ul>
            </Col>
          </Row>
          <Switch>
            <Route path={`/graphs/:graphID`} children={<GraphSwitch graphsByKey={graphsByKey} />} />
          </Switch>
        </Container>
      </div>
  );
}

function GraphSwitch({graphsByKey}) {
  let {graphID} = useParams()
  let graph = graphsByKey[graphID]
  let type = graph.graphType['__typename']
  let GraphComponent = graphTypes[type].component
  return (<GraphComponent graph={graph}/>)
}

export default Graphs;
