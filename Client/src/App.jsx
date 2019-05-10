import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';

import LoginForm from './Components/LoginForm';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';

const client = new ApolloClient({
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
      loaded: false,
      sidebarOpen: true,
      user: null,
    };
    // This binding is necessary to make `this` work in the callback
    this.sidebarToggle = this.sidebarToggle.bind(this);

    this.renderAdminApp = this.renderAdminApp.bind(this);

    this.setUser = this.setUser.bind(this);

    this.getUser = this.getUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    client.query({ query: GET_SELF })
      .then(response => this.setUser(response.data.getSelf)).finally(() => { this.setLoaded(); });
  }

  setUser(data) {
    this.setState(() => (
      { user: data }
    ));
  }

  setLoaded() {
    this.setState(() => (
      { loaded: true }
    ));
  }

  sidebarToggle() {
    this.setState(prevState => (
      { sidebarOpen: !prevState.sidebarOpen }
    ));
  }


  renderAdminApp() {
    const { sidebarOpen, user } = this.state;
    return (
      <div className={`sidebar-mini ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapse'}`}>
        <Navbar sidebarToggle={this.sidebarToggle} />
        <Sidebar sidebarOpen={sidebarOpen} user={user} />
      </div>
    );
  }

  render() {
    const { user, loaded } = this.state;

    return (
      <ApolloProvider client={client}>
        <Router>
          {loaded ? (
            <div>
              {user ? this.renderAdminApp() : (<LoginForm getUser={this.getUser} />)}
            </div>
          ) : ''}
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
