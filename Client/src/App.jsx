import React from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';

import Main from './Pages/Main';
import Login from './Pages/Login';

let client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include',
});

const GET_SELF = gql`
  {
    getSelf {
      userId
      name
      email
      password
      avatar
      roles{
        roleId
        name
        level
        createdDate
        modifiedDate
      }
      superiorId
      }
  }
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loaded: false,
    };
    // This binding is necessary to make `this` work in the callback

    this.setUser = this.setUser.bind(this);
    this.setLoaded = this.setLoaded.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getUser();
    }
  }

  getUser() {
    client = new ApolloClient({
      uri: 'http://localhost:3001/graphql',
      credentials: 'include',
    });
    client.query({ query: GET_SELF, errorPolicy: 'ignore' })
      .then(response => this.setUser(response.data.getSelf));
  }

  setLoaded(data) {
    this.setState(() => (
      { loaded: data }
    ));
  }

  setUser(data) {
    this.setState(() => (
      { user: data, loaded: true }
    ));
  }

  render() {
    const { user, loaded } = this.state;
    return (
      <ApolloProvider client={client}>
        <Router>
          {loaded ? (
            <Switch>
              <Route
                exact
                path="/login"
                render={props => (!user ? (<Login {...props} setLoaded={this.setLoaded} />) : (
                  <Redirect
                    to="/"
                  />
                ))}
              />
              <Route
                exact
                path="/register"
                render={props => (!user ? (<Login {...props} setLoaded={this.setLoaded} />) : (
                  <Redirect
                    to="/"
                  />
                ))}
              />
              <Route
                path="/"
                render={props => (user ? (
                  <Main
                    {...props}
                    user={user}
                    setLoaded={this.setLoaded}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: '/login',
                      state: { from: props.location },
                    }}
                  />
                ))}
              />
            </Switch>
          ) : ''}
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
