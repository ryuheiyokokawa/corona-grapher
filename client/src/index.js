import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost/lib/index';
import { InMemoryCache } from "apollo-cache-inmemory";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { TYPEDEFS } from './queries/client'
import { resolvers } from './resolvers'


const cache = new InMemoryCache({
                freezeResults: true
              })
//init local client cache related stuff here.
cache.writeData({
    data: {
      graphs: []
    }
})

// Below uses the appolo client cache as part of the local state management.
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_SERVER,
  cache: cache,
  TYPEDEFS,
  resolvers,
  assumeImmutableResults: true
});

const AppWrapped = () => (
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
)

ReactDOM.render(<AppWrapped />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
