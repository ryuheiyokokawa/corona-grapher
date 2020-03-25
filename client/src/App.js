import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import About from  './components/about'
import Graphs from './components/graphs'
import AddNewGraph from './components/add-new-graph'

import './App.scss';



function App() {
  //Gonna load site-wide data first.
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