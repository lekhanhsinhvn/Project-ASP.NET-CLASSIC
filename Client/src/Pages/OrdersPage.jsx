import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import ErrorPage from './ErrorPage';
import OrderDetail from './OrderDetail';
import OrderList from './OrderList';

let client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include',
});

const clearStore = () => {
  client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    credentials: 'include',
  });
};

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
const GET_ORDER = gql`
query GetOrder($orderId: Int!){
    getOrder(orderId: $orderId){
        orderId
        inferior{
          userId
          name
          email
          avatar
          roles{
              roleId
              name
              level
          }
        }
        superior{
          userId
          name
          email
          avatar
          roles{
              roleId
              name
              level
          }
        }
        orderDetails{
          product{
            productId
            name
            image
          }
          quantity
          unitPrice
        }
        totalCount
        totalPrice
        status
        createdDate
        modifiedDate
    }
  }
`;
class OrdersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { self } = this.props;
    return (
      <Switch>
        <Route
          exact
          path="/orders/detail"
          render={(props) => {
            clearStore();
            return (
              <Query query={GET_ORDER} client={client} variables={{ orderId: getUrlParameter('OrderId') }}>
                {({
                  loading, error, data, refetch,
                }) => {
                  if (loading) return '';
                  if (error) return (<ErrorPage code="300" message={error.message} />);
                  return (
                    <OrderDetail
                      {...props}
                      header={`Id: ${data.getOrder.orderId}`}
                      refetch={refetch}
                      self={self}
                      dataOrder={data.getOrder}
                    />
                  );
                }}
              </Query>
            );
          }}
        />
        <Route
          path="/orders"
          render={props => (
            <OrderList
              {...props}
              self={self}
              header="Orders List"
            />
          )}
        />
      </Switch>
    );
  }
}

OrdersPage.propTypes = {
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

export default OrdersPage;
