import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from "apollo-cache-inmemory";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { TYPEDEFS } from './queries/client'
import { resolvers } from './resolvers'


const cache = new InMemoryCache({
                freezeResults: true
              })

// TODO: Change below with environmental var. Make GraphQL config. 
// Below uses the appolo client cache as part of the local state management.
const client = new ApolloClient({
  uri: 'http://127.0.0.1:3333/',
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
