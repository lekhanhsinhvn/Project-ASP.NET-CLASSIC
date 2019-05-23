import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer,
} from 'recharts';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-boost';

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
const GETORDERSSUPERIOR = gql`
  query GetOrdersfromUserasSuperior($userId: Int, $pageNum: Int, $maxPerPage: Int, $search: String, $sort: String, $asc: Boolean){
    getOrdersfromUserasSuperior(userId: $userId, pageNum: $pageNum, maxPerPage: $maxPerPage, search: $search, sort: $sort, asc: $asc) {
        totalCount
        totalPrice
        modifiedDate
    }
  }
`;

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
    this.getOrders = this.getOrders.bind(this);
  }

  componentWillMount() {
    this.getOrders();
  }

  getOrders() {
    const { self } = this.props;
    clearStore();
    client.query({
      query: GETORDERSSUPERIOR,
      variables: { userId: self.userId },
      errorPolicy: 'ignore',
    })
      .then((response) => {
        this.setState(() => ({ orders: response.data.getOrdersfromUserasSuperior }));
      });
  }

  render() {
    const { orders } = this.state;
    return (
      <div className="col-lg-7">
        <div className="card">
          <div className="card-header">
            <h3>
              <i className="fas fa-pie-chart mr-1" />
              Product Ordered
            </h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer height={250}>
              <LineChart
                data={orders}
                margin={{
                  top: 20, right: 30, left: 0, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="modifiedDate" />
                <YAxis type="number" domain={['dataMin', 'dataMax']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalCount" stroke="#8884d8" />
                <Line type="monotone" dataKey="totalPrice" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}

Chart.propTypes = {
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

export default Chart;
