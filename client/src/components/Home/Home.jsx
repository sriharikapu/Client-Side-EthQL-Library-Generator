import React, { Component } from 'react';
import { Query } from 'react-apollo';

import getWeb3 from '../../utils/getWeb3';
import { BLOCK_TEST } from '../../queries';
import * as library from '../../lib/index';

class Home extends Component {

  state = {
    web3: null,
    accounts: null,
    testing: null,
  };

  componentDidMount = async () => {

    try {

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Execute library test method.
      const testing = library.testing();

      // Set web3 and accounts to the state.
      this.setState({ web3, accounts, testing });

    } catch (error) {

      // Catch any errors for any of the above operations.
      alert(`Failed to load web3 or accounts. Check console for details.`);

      // Log operation error.
      console.error(error);

    }

  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3 and accounts...</div>;
    }
    return (
      <div>
        <h1>Library Test</h1>
        <p>{this.state.testing}</p>
        <h1>GraphQL Test</h1>
        <Query query={BLOCK_TEST}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            return (
              <p>{JSON.stringify(data)}</p>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Home;
