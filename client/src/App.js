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
  
  
  return (
    <Router>
      <header>
        <h1>Coronavirus Grapher</h1>
        <h2>Because it's interesting, but also because it sucks.</h2>
      </header>
      <AddNewGraph/>
      <Switch>
        <Route path="/" component={Graphs}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Router>
  )
}

export default App;