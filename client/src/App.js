import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { GET_GRAPHS } from './queries/client'

import About from  './components/about'
import Graphs from './components/graphs'
import AddNewGraph from './components/add-new-graph'

import './App.scss';

function App() {
  //Gonna load site-wide data first.
  const {data} = useQuery(GET_GRAPHS)
  console.log(data)
  
  return (
    <Router>
      <header>
        <h1>Coronavirus Grapher</h1>
        <h2>Because it's interesting, but also because it sucks.</h2>
      </header>
      <Switch>
        <AddNewGraph/>
        <Route path="/about">
          <About/>
        </Route>
        <Route path="/graphs">
          <Graphs/>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;