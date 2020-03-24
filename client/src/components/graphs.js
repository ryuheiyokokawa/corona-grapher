import React from 'react';
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

import LineGraph from './line'
import PieGraph from './pie'
import StackedBarGraph from './stacked-bar'
import StackedAreaGraph from './stacked-area'


const graphTypes = {
  line: {
    name: 'Line',
    component: LineGraph
  },
  pie: {
    name: 'Pie',
    component: PieGraph
  },
  stackedBar: {
    name: 'Stacked Bar',
    component: StackedBarGraph
  },
  stakcedArea: {
    name: 'Stacked Area',
    component: StackedAreaGraph
  }
}

function Graphs() {
  let { path, url } = useRouteMatch();

  return (
      <div className="graphs-wrapper">
        <ul>
          {Object.keys(graphTypes).map((type) => {
            let graphType = graphTypes[type]
            return (
              <li>
                <Link to={`${url}/${type}`} >{graphType.name}</Link>
              </li>
            )
          })}
        </ul>
        <Switch>
            <Route exact path={path}>
                <h3>Select a graph type.</h3>
            </Route>
            <Route path={`${path}/:graphType`}>
              <GraphSwitch/>
            </Route>
        </Switch>
      </div>
  );
}

function GraphSwitch() {
  let { graphType } = useParams()
  let GraphComponent = graphType[graphType].component
  return (<GraphComponent/>)
}


export default Graphs;
