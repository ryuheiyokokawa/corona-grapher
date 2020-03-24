import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useQuery, ApolloConsumer, useMutation } from '@apollo/react-hooks';

import About from  './components/about'
import Graphs from './components/graphs'
import AddNewGraph from './components/add-new-graph'
import ErrorLoading from './components/error-loading'
import { COUNTRIES_AND_PROVINCES } from './queries'
import { STORE_COUNTRIES_PROVINCES } from './queries/client'

import './App.scss';



function App() {
  //Gonna load site-wide data first.
  const {loading, error, data, client} = useQuery(COUNTRIES_AND_PROVINCES)
  const [ storeCountriesProvinces ] = useMutation(STORE_COUNTRIES_PROVINCES)
  return (
    <ErrorLoading loading={loading} error={error} show={() => {
      const { countries, provinces } = data
      //Done this way to prevent re-rendering
      client.writeData({
        data: {
          countries: alphaSort(countries,'name'),
          provinces: alphaSort(provinces,'name')
        }
      })
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
    }}/>
  );
}


export default App;

const alphaSort = (array, key) => {
  //Slice below is just to make a new array
  const newArray = array.slice().sort((a,b) => {
      let nA = a[key].toLowerCase()
      let nB = b[key].toLowerCase()
      if(nA < nB) {
          return -1
      }
      if(nA > nB) {
          return 1
      }
      return 0
  })
  return newArray
}
