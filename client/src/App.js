import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {Col, Row, Container} from 'react-bootstrap'

import About from  './components/about'
import Graphs from './components/graphs'
import AddNewGraph from './components/add-new-graph'

import './App.scss';

function App() {
  return (
    <Router>
      <Container>
        <Row>
          <Col>
            <header className="border-bottom">
              <h1>Coronavirus Grapher</h1>
              <h3>Because it's interesting, but also because it sucks.</h3>
              <p>Click on the blue plus button!</p>
            </header>
          </Col>
        </Row>
      </Container>

      <AddNewGraph/>

      <Switch>
        <Route path="/" component={Graphs}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Router>
  )
}

export default App;