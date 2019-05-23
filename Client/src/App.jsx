import React from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import Main from './Pages/Main';
import Login from './Pages/Login';
import Register from './Pages/Register';

const override = css`
      display: block;
      margin: 0 auto;
      position: absolute !important;
      top: 38%;
      left: 42%;
  `;

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

const clearStore = () => {
  client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    credentials: 'include',
  });
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      self: null,
      loaded: false,
    };
    // This binding is necessary to make `this` work in the callback

    this.setSelf = this.setSelf.bind(this);
    this.setLoaded = this.setLoaded.bind(this);
    this.getSelf = this.getSelf.bind(this);
  }

  componentDidMount() {
    this.getSelf();
  }

  getSelf() {
    clearStore();
    client.query({ query: GET_SELF, errorPolicy: 'ignore' })
      .then((response) => {
        if (response.data) this.setSelf(response.data.getSelf);
        this.setLoaded(true);
      });
  }

  setSelf(data) {
    const { self } = this.state;
    if (self !== data) {
      this.setState(() => (
        { self: data, loaded: true }
      ));
    }
  }

  setLoaded(data) {
    const { loaded } = this.state;
    if (loaded !== data) {
      this.setState(() => (
        { loaded: data }
      ));
    }
  }

  render() {
    const { self, loaded } = this.state;
    return (
      <ApolloProvider client={client}>
        <Router>
          {loaded ? (
            <Switch>
              <Route
                exact
                path="/login"
                render={props => (!self ? (<Login {...props} getSelf={this.getSelf} />) : (
                  <Redirect
                    to="/"
                  />
                ))}
              />
              <Route
                exact
                path="/register"
                render={props => (!self ? (<Register {...props} />) : (
                  <Redirect
                    to="/"
                  />
                ))}
              />
              <Route
                path="/"
                render={props => (self ? (
                  <Main
                    {...props}
                    self={self}
                    getSelf={this.getSelf}
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
          ) : (
            <BounceLoader
              css={override}
              sizeUnit="px"
              size={200}
              color="blue"
            />
          )}
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
