import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import UserList from './UserList';
import UserDetail from './UserDetail';
import ErrorPage from './ErrorPage';

const getUrlParameter = function getUrlParameter(sParam) {
  const sPageURL = window.location.search.substring(1);
  const sURLVariables = sPageURL.split('&');
  let sParameterName;
  let i;

  for (i = 0; i < sURLVariables.length; i += 1) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return null;
};

const GET_USER = gql`
query GetUser($userId:Int!){
  getUser(userId:$userId) {
    userId
    name
    email
    avatar
    roles{
      roleId
      name
      level
      createdDate
      modifiedDate
    }
    superiorId
    createdDate
      modifiedDate
  }
}
`;
const GET_SELF = gql`
  {
    getSelf {
      userId
      name
      email
      avatar
      roles{
        roleId
        name
        level
        createdDate
        modifiedDate
      }
      superiorId
      createdDate
      modifiedDate
      }
  }
`;
const GET_SUPERIOR = gql`
  {
    getSuperior {
      userId
      name
      email
      avatar
      roles{
        roleId
        name
        level
        createdDate
        modifiedDate
      }
      superiorId
      createdDate
      modifiedDate
      }
  }
`;
class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { self, getSelf } = this.props;
    return (
      <Switch>
        <Route
          exact
          path="/users/detail"
          render={props => (
            <Query query={GET_USER} variables={{ userId: getUrlParameter('UserId') }}>
              {({
                loading, error, data, refetch,
              }) => {
                if (loading) return '';
                if (error) return (<ErrorPage code="300" message={error.message} />);
                return (
                  <UserDetail
                    {...props}
                    QUERY="USER"
                    edit
                    self={self}
                    header={data && data.getUser.name}
                    dataUser={data && data.getUser}
                    getSelf={getSelf}
                    refetch={refetch}
                    setReload={this.setReload}
                  />
                );
              }}
            </Query>
          )}
        />
        <Route
          exact
          path="/users/superior"
          render={props => (
            <Query query={GET_SUPERIOR}>
              {({
                loading, error, data, refetch,
              }) => {
                if (loading) return '';
                if (error) return (<ErrorPage code="300" message="You don't have a Superior" />);
                return (
                  <UserDetail
                    {...props}
                    QUERY="SELF"
                    edit={false}
                    self={self}
                    getSelf={getSelf}
                    refetch={refetch}
                    header="Superior"
                    dataUser={data && data.getSuperior}
                  />
                );
              }}
            </Query>
          )}
        />
        <Route
          exact
          path="/users/me"
          render={props => (
            <Query query={GET_SELF}>
              {({
                loading, error, data,
              }) => {
                if (loading) return 'Loading...';
                if (error) return (<ErrorPage code="300" message={error.message} />);
                return (
                  <UserDetail
                    {...props}
                    QUERY="SELF"
                    edit
                    self={self}
                    dataUser={data && data.getSelf}
                    header="Me"
                    getSelf={getSelf}
                  />
                );
              }}
            </Query>
          )}
        />
        <Route
          exact
          path="/users"
          render={props => (
            <UserList
              {...props}
              getSelf={getSelf}
              header="Users List"
            />
          )}
        />
      </Switch>
    );
  }
}
UsersPage.propTypes = {
  self: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      roleId: PropTypes.number,
      name: PropTypes.string,
      level: PropTypes.number,
    })),
  }).isRequired,
  getSelf: PropTypes.func.isRequired,
};

export default UsersPage;
