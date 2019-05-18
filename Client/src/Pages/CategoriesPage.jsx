import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import _ from 'lodash';

import ErrorPage from './ErrorPage';
import CategoryDetail from './CategoryDetail';
import CategoryList from './CategoryList';
import CategoryCreate from './CategoryCreate';

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
const GET_CATEGORY = gql`
query Getcatgory($categoryId: Int!){
    getCategory(categoryId:$categoryId){
        categoryId
        name
        description
    }
  }
`;
class CategoriesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { self } = this.props;
    const edit = (_.find(self.roles, { name: 'Admin' }) !== undefined);
    return (
      <Switch>
        <Route
          exact
          path="/categories/detail"
          render={props => (
            <Query query={GET_CATEGORY} variables={{ categoryId: getUrlParameter('CategoryId') }}>
              {({
                loading, error, data, refetch,
              }) => {
                if (loading) return '';
                if (error) return (<ErrorPage code="300" message={error.message} />);
                return (
                  <CategoryDetail
                    {...props}
                    header={data.getCategory.name}
                    refetch={refetch}
                    edit={edit}
                    dataCategory={data.getCategory}
                  />
                );
              }}
            </Query>
          )}
        />
        <Route
          exact
          path="/categories/create"
          render={props => (
            <CategoryCreate
              {...props}
              header="Create Category"
            />
          )}
        />
        <Route
          exact
          path="/categories"
          render={props => (
            <CategoryList
              {...props}
              header="Category List"
            />
          )}
        />
      </Switch>
    );
  }
}

CategoriesPage.propTypes = {
  self: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
};

export default CategoriesPage;
