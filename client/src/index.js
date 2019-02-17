import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import getApollo from './utils/getApollo';
import Home from './components/Home';

getApollo().then(apolloClient => {
  const App = () => (
    <ApolloProvider client={apolloClient}>
      <Home />
    </ApolloProvider>
  );
  ReactDOM.render(<App />, document.getElementById('root'));
});
