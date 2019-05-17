import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import _ from 'lodash';

import ErrorPage from './ErrorPage';
import ProductDetail from './ProductDetail';
import ProductList from './ProductList';
import ProductCreate from './ProductCreate';

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
const GET_PRODUCT = gql`
query GetProduct($productId: Int!){
    getProduct(productId: $productId){
      productId
      name
      description
      image
      categories{
        categoryId
        name
        description
        createdDate
        modifiedDate
      }
      price
      quantity
      createdDate
      modifiedDate 
    }
  }
`;
class ProductsPage extends React.Component {
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
          path="/products/detail"
          render={props => (
            <Query query={GET_PRODUCT} variables={{ productId: getUrlParameter('ProductId') }}>
              {({
                loading, error, data, refetch,
              }) => {
                if (loading) return '';
                if (error) return (<ErrorPage code="300" message={error.message} />);
                return (
                  <ProductDetail
                    {...props}
                    header={data.getProduct.name}
                    refetch={refetch}
                    edit={edit}
                    dataProduct={data.getProduct}
                  />
                );
              }}
            </Query>
          )}
        />
        <Route
          exact
          path="/products/create"
          render={props => (
            <ProductCreate
              {...props}
              header="Create Product"
            />
          )}
        />
        <Route
          exact
          path="/products"
          render={props => (
            <ProductList
              {...props}
              header="Product List"
            />
          )}
        />
      </Switch>
    );
  }
}

ProductsPage.propTypes = {
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

export default ProductsPage;
