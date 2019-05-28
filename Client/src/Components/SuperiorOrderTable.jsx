import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-boost';
import _ from 'lodash';

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

const GETTOTALCOUNTORDERSSUPERIOR = gql`
query GetTotalCountOrdersfromUserasSuperior($userId: Int!){
      getTotalCountOrdersfromUserasSuperior(userId: $userId)
  }
`;

const GETORDERSSUPERIOR = gql`
  query GetOrdersfromUserasSuperior($userId: Int, $pageNum: Int, $maxPerPage: Int, $search: String, $sort: String, $asc: Boolean){
    getOrdersfromUserasSuperior(userId: $userId, pageNum: $pageNum, maxPerPage: $maxPerPage, search: $search, sort: $sort, asc: $asc) {
        orderId
        inferior{
          userId
          name
          email
          }
        superior{
          userId
          name
          email
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

let sortting = 'ModifiedDate';
let asccing = true;

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

class SuperiorOrderTable extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.state = {
      orders: null,
      totalCountOrder: 0,
    };
    this.redirect = this.redirect.bind(this);
    this.setOrders = this.setOrders.bind(this);
    this.getOrders = this.getOrders.bind(this);
  }

  componentDidMount() {
    const pageNum = getUrlParameter('pageNum') !== null ? parseInt(getUrlParameter('pageNum'), 10) : 0;
    const maxPerPage = getUrlParameter('maxPerPage') !== null ? parseInt(getUrlParameter('maxPerPage'), 10) : 10;
    const search = getUrlParameter('search') !== null ? getUrlParameter('search') : '';
    const sort = getUrlParameter('sort') !== null ? getUrlParameter('sort') : '';
    const asc = getUrlParameter('asc') !== null ? getUrlParameter('asc') : true;
    this.getOrders({
      pageNum, maxPerPage, search, sort, asc,
    });
  }

  componentDidUpdate() {
    const pageNum = getUrlParameter('pageNum') !== null ? parseInt(getUrlParameter('pageNum'), 10) : 0;
    const maxPerPage = getUrlParameter('maxPerPage') !== null ? parseInt(getUrlParameter('maxPerPage'), 10) : 10;
    const search = getUrlParameter('search') !== null ? getUrlParameter('search') : '';
    const sort = getUrlParameter('sort') !== null ? getUrlParameter('sort') : '';
    const asc = getUrlParameter('asc') !== null ? getUrlParameter('asc') : true;
    this.getOrders({
      pageNum, maxPerPage, search, sort, asc,
    });
  }

  setOrders(orders, totalCountOrder) {
    const { orders: orders1 } = this.state;
    if (!_.isEqual(orders1, orders)) {
      this.setState(() => (
        { orders, totalCountOrder }
      ));
    }
  }

  getOrders({
    pageNum, maxPerPage, search, sort, asc,
  }) {
    const { orders } = this.state;
    const { self } = this.props;
    let dataOrders;
    let dataTotalCountOrders;
    clearStore();
    client.query({
      query: GETORDERSSUPERIOR,
      variables: {
        userId: self.userId, pageNum, maxPerPage, search, sort, asc,
      },
      errorPolicy: 'ignore',
    })
      .then((response) => {
        dataOrders = response.data.getOrdersfromUserasSuperior;
        if (!_.isEqual(orders, dataOrders)) {
          client.query({
            query: GETTOTALCOUNTORDERSSUPERIOR,
            variables: { userId: self.userId },
            errorPolicy: 'ignore',
          }).then((response1 = response) => {
            dataTotalCountOrders = response1.data.getTotalCountOrdersfromUserasSuperior;
            this.setOrders(dataOrders, dataTotalCountOrders);
          });
        }
      });
  }

  redirect({
    pageNum, maxPerPage, search, sort, asc,
  }) {
    const { history } = this.props;
    history.push(`/orders/superior?pageNum=${pageNum}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`);
  }

  render() {
    const { orders, totalCountOrder } = this.state;
    const pageNum = getUrlParameter('pageNum') !== null ? parseInt(getUrlParameter('pageNum'), 10) : 0;
    const maxPerPage = getUrlParameter('maxPerPage') !== null ? parseInt(getUrlParameter('maxPerPage'), 10) : 10;
    const search = getUrlParameter('search') !== null ? getUrlParameter('search') : '';
    const sort = getUrlParameter('sort') !== null ? getUrlParameter('sort') : '';
    const asc = getUrlParameter('asc') !== null ? getUrlParameter('asc') : true;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_length">
              <label htmlFor="maxPerPage">
                {'Show '}
                <select
                  value={maxPerPage}
                  id="maxPerPage"
                  name="maxPerPage"
                  className="form-control form-control-sm"
                  onChange={event => this.redirect({
                    pageNum: 0, maxPerPage: event.target.value, search, sort, asc,
                  })}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                {' entries.'}
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_filter">
              <label htmlFor="search">
                {'Search: '}
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search"
                  value={getUrlParameter('search') !== null ? getUrlParameter('search') : ''}
                  onChange={event => this.redirect({
                    pageNum, maxPerPage, search: event.target.value, sort, asc,
                  })}
                />
              </label>
            </div>
          </div>
        </div>
        {orders !== null ? (
          <React.Fragment>
            <div style={{ overflowX: 'auto' }}>
              <table className="table dataTable table-bordered table-hover">
                <thead>
                  <tr>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        asccing = sortting === 'OrderId' ? !asccing : true;
                        sortting = 'OrderId';
                        this.redirect({
                          pageNum, maxPerPage, search, sort: sortting, asc: asccing,
                        });
                      }}
                    >
                      {'OrderId'}
                      {sortting === 'OrderId'
                        ? (<div className="float-right">{asccing ? (<i className="fas fa-arrow-up" />) : <i className="fas fa-arrow-down" />}</div>)
                        : ''}
                    </th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        asccing = sortting === 'InferiorName' ? !asccing : true;
                        sortting = 'InferiorName';
                        this.redirect({
                          pageNum, maxPerPage, search, sort: sortting, asc: asccing,
                        });
                      }}
                    >
                      {'Inferior Name'}
                      {sortting === 'InferiorName'
                        ? (<div className="float-right">{asccing ? (<i className="fas fa-arrow-up" />) : <i className="fas fa-arrow-down" />}</div>)
                        : ''}
                    </th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        asccing = sortting === 'TotalCount' ? !asccing : true;
                        sortting = 'TotalCount';
                        this.redirect({
                          pageNum, maxPerPage, search, sort: sortting, asc: asccing,
                        });
                      }}
                    >
                      {'Total Count'}
                      {sortting === 'TotalCount'
                        ? (<div className="float-right">{asccing ? (<i className="fas fa-arrow-up" />) : <i className="fas fa-arrow-down" />}</div>)
                        : ''}

                    </th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        asccing = sortting === 'TotalPrice' ? !asccing : true;
                        sortting = 'TotalPrice';
                        this.redirect({
                          pageNum, maxPerPage, search, sort: sortting, asc: asccing,
                        });
                      }}
                    >
                      {'Total Price'}
                      {sortting === 'TotalPrice'
                        ? (<div className="float-right">{asccing ? (<i className="fas fa-arrow-up" />) : <i className="fas fa-arrow-down" />}</div>)
                        : ''}

                    </th>
                    <th>Status</th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        asccing = sortting === 'CreatedDate' ? !asccing : true;
                        sortting = 'CreatedDate';
                        this.redirect({
                          pageNum, maxPerPage, search, sort: sortting, asc: asccing,
                        });
                      }}
                    >
                      {'CreatedDate'}
                      {sortting === 'CreatedDate'
                        ? (<div className="float-right">{asccing ? (<i className="fas fa-arrow-up" />) : <i className="fas fa-arrow-down" />}</div>)
                        : ''}

                    </th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        asccing = sortting === 'ModifiedDate' ? !asccing : true;
                        sortting = 'ModifiedDate';
                        this.redirect({
                          pageNum, maxPerPage, search, sort: sortting, asc: asccing,
                        });
                      }}
                    >
                      {'ModifiedDate'}
                      {sortting === 'ModifiedDate'
                        ? (<div className="float-right">{asccing ? (<i className="fas fa-arrow-up" />) : <i className="fas fa-arrow-down" />}</div>)
                        : ''}
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {orders && orders.map((order, index) => (
                    <tr
                      key={order.orderId || index}
                    >
                      <td>
                        <Link to={`/orders/detail?OrderId=${order.orderId}`}>
                          {order.orderId}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/users/detail?UserId=${order.inferior.userId}`}>
                          {order.inferior.name}
                        </Link>
                      </td>
                      <td>{order.totalCount}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.status}</td>
                      <td>{order.createdDate}</td>
                      <td>{order.modifiedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalCountOrder !== null ? (
              <div className="row">
                <div className="col-sm-12 col-md-5">
                  <div className="dataTables_info">
                    {`Showing ${pageNum * maxPerPage + 1} to ${((pageNum + 1) * maxPerPage > totalCountOrder) ? totalCountOrder : (pageNum + 1) * maxPerPage} of ${totalCountOrder} entries`}
                  </div>
                </div>
                <div className="col-sm-12 col-md-7">
                  <div className="dataTables_paginate paging_simple_numbers">
                    <ul className="pagination">
                      <li className={`paginate_button page-item ${pageNum - 1 >= 0 ? '' : 'disabled'}`}>
                        {pageNum - 1 >= 0
                          ? (<Link className="page-link" to={`/orders/superior?pageNum=${pageNum - 1}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>Previous</Link>)
                          : (<div className="page-link">Previous</div>)}
                      </li>
                      <li className="paginate_button page-item">
                        {pageNum - 2 >= 0
                          ? (<Link className="page-link" to={`/orders/superior?pageNum=${pageNum - 2}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>{pageNum - 1}</Link>)
                          : ''}
                      </li>
                      <li className="paginate_button page-item">
                        {pageNum - 1 >= 0
                          ? (<Link className="page-link" to={`/orders/superior?pageNum=${pageNum - 1}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>{pageNum}</Link>)
                          : ''}
                      </li>
                      <li className="paginate_button page-item active disabled">
                        <div className="page-link">{pageNum + 1}</div>
                      </li>
                      <li className="paginate_button page-item">
                        {(pageNum + 1) * maxPerPage < totalCountOrder
                          ? (<Link className="page-link" to={`/orders/superior?pageNum=${pageNum + 1}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>{pageNum + 2}</Link>)
                          : ''}
                      </li>
                      <li className="paginate_button page-item">
                        {(pageNum + 2) * maxPerPage < totalCountOrder
                          ? (<Link className="page-link" to={`/orders/superior?pageNum=${pageNum + 2}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>{pageNum + 3}</Link>)
                          : ''}
                      </li>
                      <li className={`paginate_button page-item ${(pageNum + 1) * maxPerPage < totalCountOrder ? '' : 'disabled'}`}>
                        {(pageNum + 1) * maxPerPage < totalCountOrder
                          ? (<Link className="page-link" to={`/orders/superior?pageNum=${pageNum + 1}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>Next</Link>)
                          : (<div className="page-link">Next</div>)}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : ''}
          </React.Fragment>
        ) : 'No result'}
      </React.Fragment>
    );
  }
}

SuperiorOrderTable.propTypes = {
  self: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default SuperiorOrderTable;
