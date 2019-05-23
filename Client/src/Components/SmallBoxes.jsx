import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-boost';

const GETTOTALCOUNTUSER = gql`
  {
    getTotalCountUser
  }
`;
const GETTOTALCOUNTPRODUCTS = gql`
  {
    getTotalCountProduct
  }
`;
const GETTOTALCOUNTORDERSSUPERIOR = gql`
query GetTotalCountOrdersfromUserasSuperior($userId: Int!){
      getTotalCountOrdersfromUserasSuperior(userId: $userId)
  }
`;

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
class SmallBoxes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCountUsers: 0,
      totalCountProducts: 0,
      totalCountOrders: 0,
    };
    this.getInfor = this.getInfor.bind(this);
  }

  componentWillMount() {
    this.getInfor();
  }

  getInfor() {
    const { self } = this.props;
    clearStore();
    client.query({
      query: GETTOTALCOUNTUSER,
      errorPolicy: 'ignore',
    }).then((response) => {
      this.setState(() => ({ totalCountUsers: response.data.getTotalCountUser }));
    });
    client.query({
      query: GETTOTALCOUNTPRODUCTS,
      errorPolicy: 'ignore',
    }).then((response) => {
      this.setState(() => ({ totalCountProducts: response.data.getTotalCountProduct }));
    });
    client.query({
      query: GETTOTALCOUNTORDERSSUPERIOR,
      variables: { userId: self.userId },
      errorPolicy: 'ignore',
    }).then((response) => {
      this.setState(() => ({ totalCountOrders: response.data.getTotalCountOrdersfromUserasSuperior }));
    });
  }

  render() {
    const { totalCountUsers, totalCountProducts, totalCountOrders } = this.state;
    return (
      <div className="row">
        <div className="col-lg-3 col-6">
          <div className="small-box bg-info">
            <div className="inner">
              <h3>{totalCountOrders}</h3>
              <p>New Orders</p>
            </div>
            <div className="icon">
              <i className="fas fa-shopping-bag" />
            </div>
            <Link to="/orders/superior" className="small-box-footer">
              {'More info '}
              <i className="fa fa-arrow-circle-right" />
            </Link>
          </div>
        </div>
        <div className="col-lg-3 col-6">
          <div className="small-box bg-success">
            <div className="inner">
              <h3>{totalCountProducts}</h3>
              <p>Total Products</p>
            </div>
            <div className="icon">
              <i className="fas fa-cubes" />
            </div>
            <Link to="/products" className="small-box-footer">
              {'More info '}
              <i className="fa fa-arrow-circle-right" />
            </Link>
          </div>
        </div>
        <div className="col-lg-3 col-6">
          <div className="small-box bg-warning">
            <div className="inner">
              <h3>{totalCountUsers}</h3>
              <p>Total User</p>
            </div>
            <div className="icon">
              <i className="fas fa-users" />
            </div>
            <Link to="/users" className="small-box-footer">
              {'More info '}
              <i className="fa fa-arrow-circle-right" />
            </Link>
          </div>
        </div>
        <div className="col-lg-3 col-6">
          <div className="small-box bg-danger">
            <div className="inner">
              <h3>404</h3>
              <p>Lorem</p>
            </div>
            <div className="icon">
              <i className="fas fa-users" />
            </div>
            <Link to="/" className="small-box-footer">
              {'More info '}
              <i className="fa fa-arrow-circle-right" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

SmallBoxes.propTypes = {
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

export default SmallBoxes;
