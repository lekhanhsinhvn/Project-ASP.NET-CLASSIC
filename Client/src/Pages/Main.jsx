import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import UserDetail from './UserDetail';

const GET_SUPERIOR = gql`
  {
    getSuperior {
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

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true,
    };
    // This binding is necessary to make `this` work in the callback
    this.sidebarToggle = this.sidebarToggle.bind(this);
  }

  sidebarToggle() {
    this.setState(prevState => (
      { sidebarOpen: !prevState.sidebarOpen }
    ));
  }

  render() {
    const { user, setLoaded } = this.props;
    const { sidebarOpen } = this.state;
    return (
      <div className={`sidebar-mini ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapse'}`}>
        <Navbar sidebarToggle={this.sidebarToggle} setLoaded={setLoaded} />
        <Sidebar sidebarOpen={sidebarOpen} user={user} />
        <div className="content-wrapper">
          <Switch>
            <Route
              exact
              path="/superior"
              render={() => (
                <Query query={GET_SUPERIOR}>
                  {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    return (
                      <UserDetail user={data.getSuperior} />
                    );
                  }}
                </Query>
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
  setLoaded: PropTypes.func.isRequired,
};
export default Main;
