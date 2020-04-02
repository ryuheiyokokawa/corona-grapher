import React, {useState} from 'react';
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
import LineAccelGraph from './line-accel';
import PieGraph from './pie'
import StackedBarGraph from './stacked-bar'
import StackedAreaGraph from './stacked-area'


const graphTypes = {
  line: {
    name: 'line',
    component: LineGraph
  },
  "line-accel": {
    name:'line-accel',
    component: LineAccelGraph
  },
  pie: {
    name: 'pie',
    component: PieGraph
  },
  "stacked-bar": {
    name: 'stacked-bar',
    component: StackedBarGraph
  },
  "stacked-area": {
    name: 'stacked-area',
    component: StackedAreaGraph
  }
}

function Graphs() {
  const { data } = useQuery(GET_GRAPHS)
  const [active,setActive] = useState(null)
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
              <ul className="nav border-bottom mb-5">
                {graphs.map((graph,i) => {
                  let linkClass = 'nav-link'
                  let activeLinkClass = linkClass + ' active'
                  let url_graph_id = window.location.href.split('graphs/')[1] //This is required to catch the case where we programmtically redirect from the input to the graph

                  if(url_graph_id == graph.id) {
                    linkClass = activeLinkClass
                  } else if(active === i) {
                    linkClass = activeLinkClass
                  }
                  
                  return (
                    <li key={i} className="nav-item">
                      <Link className={linkClass} to={`/graphs/${graph.id}`} onClick={()=>{setActive(i)}} >{graph.title}</Link>
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
