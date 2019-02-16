import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import apolloClient from './utils/getApollo';
import Home from './components/Home';

const App = () => (
  <ApolloProvider client={apolloClient}>
    <Home />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
