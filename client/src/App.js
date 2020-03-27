import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {Col, Row, Container} from 'react-bootstrap'
import ForkMeOnGithub from 'fork-me-on-github';


import About from  './components/about'
import Graphs from './components/graphs'
import AddNewGraph from './components/add-new-graph'

import './App.scss';

function App() {
  return (
    <Router>
      <ForkMeOnGithub
        repo="https://github.com/ryuheiyokokawa/corona-grapher"
        text="View on Github"
        colorBackground="black"
        colorOctocat="white"
      />
      <Container>
        <Row>
          <Col>
            <header className="border-bottom">
              <h1>Coronavirus Grapher</h1>
              <h3>Because it's interesting, but also because it sucks.</h3>
              <p>Click on the blue plus button! Data from <a href="https://github.com/CSSEGISandData/COVID-19/" target="_blank">John's Hopkins Github</a>.</p>
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