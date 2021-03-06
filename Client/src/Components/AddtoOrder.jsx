import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Modal from 'react-modal';
import { Mutation } from 'react-apollo';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';
import ApolloClient from 'apollo-boost';
import _ from 'lodash';

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

const override = css`
      display: block;
      margin: 0 auto;
  `;
const GETUSERORDERSWITHSTATUS_QUERY = gql`
query GetOrdersUserandStatus($userId: Int!,$status: String){
  getOrdersUserandStatus(userId: $userId, status: $status){
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
const CREATEORDER_QUERY = gql`
mutation CreateOrder($inferiorId: Int!, $superiorId: Int!, $order: OrderInput){
    createOrder(inferiorId:$inferiorId, superiorId:$superiorId, order:$order){
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
const DELETEORDER_QUERY = gql`
mutation CreateOrder($orderId: Int!){
    deleteOrder(orderId:$orderId){
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
const UPDATEORDER_QUERY = gql`
mutation UpdateOrder($order: OrderInput){
    updateOrder(order:$order){
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
class AddtoOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      orders: [],
      currOrder: null,
      ogOrder: null,
      err: null,
    };
    this.setModal = this.setModal.bind(this);
    this.orderChange = this.orderChange.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.selectOrder = this.selectOrder.bind(this);
    this.setErr = this.setErr.bind(this);
  }

  componentDidMount() {
    Modal.setAppElement('#content');
  }

  setErr(data) {
    const data1 = data.replace('GraphQL error:', '');
    this.setState(() => ({
      err: data1,
    }));
  }

  setModal(modalIsOpen) {
    const { self } = this.props;
    const { currOrder } = this.state;
    clearStore();
    if (modalIsOpen === true) {
      client.query({
        query: GETUSERORDERSWITHSTATUS_QUERY,
        variables: { userId: self.userId, status: 'Adding' },
      })
        .then((response) => {
          if (currOrder) {
            this.setState(() => (
              {
                modalIsOpen,
                orders: response.data.getOrdersUserandStatus,
                currOrder: _.find(response.data.getOrdersUserandStatus,
                  o => o.orderId === currOrder.orderId),
                ogOrder: _.cloneDeep(_.find(response.data.getOrdersUserandStatus,
                  o => o.orderId === currOrder.orderId)),
              }
            ));
          } else {
            this.setState(() => (
              {
                modalIsOpen,
                orders: response.data.getOrdersUserandStatus,
                currOrder: response.data.getOrdersUserandStatus[0],
                ogOrder: _.cloneDeep(response.data.getOrdersUserandStatus[0]),
              }
            ));
          }
        });
    } else {
      this.setState(() => (
        {
          modalIsOpen,
          orders: null,
          currOrder: null,
          ogOrder: null,
        }
      ));
    }
  }

  selectOrder(event) {
    const { orders } = this.state;
    this.setState({
      currOrder: orders[event.target.value],
      ogOrder: _.cloneDeep(orders[event.target.value]),
    });
  }

  createOrder() {
    const { refresh, self } = this.props;
    client.mutate({
      mutation: CREATEORDER_QUERY,
      variables: {
        inferiorId: self.userId,
        superiorId: self.superiorId,
        order: {
          orderDetails: [],
          quantity: 0,
          unitPrice: 0,
        },
      },
      errorPolicy: 'none',
    }).then((response) => {
      this.setState(() => ({ currOrder: response.data.createOrder }));
      this.setModal(true);
      refresh();
    }).catch((e) => {
      this.setErr(e.message);
    });
  }

  deleteOrder() {
    const { refresh } = this.props;
    const { currOrder } = this.state;
    if (currOrder) {
      client.mutate({
        mutation: DELETEORDER_QUERY,
        variables: {
          orderId: currOrder.orderId,
        },
        errorPolicy: 'none',
      }).then(() => {
        this.setModal(true);
        refresh();
      }).catch((e) => {
        this.setErr(e.message);
      });
    } else {
      this.setErr('There\'s no Order');
    }
  }

  orderChange(event) {
    let { currOrder } = this.state;
    const { dataProduct } = this.props;
    if (currOrder) {
      if (!currOrder.orderDetails) {
        currOrder = { ...currOrder, orderDetails: [] };
      }
      const od = _.find(currOrder.orderDetails,
        o => o.product.productId === dataProduct.productId);
      if (od !== undefined) {
        od.quantity = parseInt(event.target.value, 10);
        if (od.quantity < 1 || Number.isNaN(od.quantity)) {
          _.remove(currOrder.orderDetails, o => o.product.productId === dataProduct.productId);
        }
      } else {
        currOrder.orderDetails.push({
          product: dataProduct,
          quantity: event.target.value,
          unitPrice: dataProduct.price,
        });
      }
      this.setState({
        currOrder,
      });
    }
  }


  render() {
    const { dataProduct, refresh } = this.props;
    const {
      modalIsOpen, orders, currOrder, ogOrder, err,
    } = this.state;
    const proQuantity = dataProduct.quantity;

    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => this.setModal(true)}
        >
          {'Add to Order'}
        </button>
        <Modal
          isOpen={modalIsOpen}
          ariaHideApp={false}
          onRequestClose={() => this.setModal(false)}
          className="modal card"
          overlayClassName="overlay"
        >
          <div style={{ padding: '20px' }}>
            <div className="card-header">
              <h3 className="float-left">
                {dataProduct.name}
              </h3>
              <label htmlFor="currOrder" className="float-right form-inline">
                {'Current Order:'}
                <select name="currOrder" className="form-control" onChange={this.selectOrder} value={_.findIndex(orders, o => o.orderId === currOrder.orderId)}>
                  {orders && orders.map((order, index) => (
                    <option value={index} key={order.Id || index}>
                      {`Id: ${order.orderId}`}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="row">
              <div style={{ marginBottom: '10px' }} className="col-8">
                {currOrder ? (
                  <React.Fragment>
                    <div style={{ overflow: 'auto', maxHeight: '200px' }}>
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currOrder && currOrder.orderDetails
                      && currOrder.orderDetails.map((orderDetail, index) => (
                        <tr
                          key={orderDetail.product.productId || index}
                        >
                          <td>{orderDetail.product.name}</td>
                          <td>
                            <img style={{ width: '50px' }} className="img-fluid" src={`/images/${orderDetail.product.image}`} alt="Product" />
                          </td>
                          <td>{orderDetail.unitPrice}</td>
                          <td>{orderDetail.quantity}</td>
                          <td>{orderDetail.unitPrice * orderDetail.quantity}</td>
                        </tr>
                      ))}
                        </tbody>
                      </table>
                    </div>
                    <span className="float-right">{`Total Count: ${currOrder.totalCount}`}</span>
                    <br />
                    <span className="float-right">{`Total Price: ${currOrder.totalPrice}`}</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span style={{ paddingLeft: '12px' }} className="text-danger">{'There\'s no Order'}</span>
                    <br />
                  </React.Fragment>
                )}
                <button type="button" className="btn btn-link align-bottom" onClick={() => this.createOrder()}>Create new order</button>
              </div>
              <div className="col-4">
                <Mutation mutation={UPDATEORDER_QUERY} errorPolicy="ignore" onCompleted={() => { this.setModal(true); refresh(); }}>
                  {(updateOrder, { loading, error }) => (
                    <form
                      className=""
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateOrder({ variables: { order: currOrder } });
                      }}
                    >
                      <div>
                        <label htmlFor="quantity">
                          {'Quantity'}
                          <div className="form-inline">
                            <div className="form-group">
                              <input
                                style={{ maxWidth: '125px' }}
                                type="number"
                                className="form-control"
                                id="quantity"
                                name="quantity"
                                placeholder="Quantity"
                                onChange={this.orderChange}
                                value={
                                  (currOrder && _.find(currOrder.orderDetails,
                                    o => o.product.productId === dataProduct.productId)
                                    !== undefined)
                                    ? _.find(currOrder.orderDetails,
                                      o => o.product.productId === dataProduct.productId).quantity
                                    : ''
                                }
                                required
                              />
                              <label htmlFor="quantity">
                                {ogOrder ? `/${proQuantity}` : ''}
                              </label>
                            </div>
                          </div>
                        </label>
                      </div>
                      <br />
                      {err && <span className="text-danger">{err}</span>}
                      {error && error.graphQLErrors.map(({ message }, i) => (
                        <span className="text-danger" key={i.toString()}>{message}</span>
                      ))}
                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          {loading ? (
                            <BounceLoader
                              css={override}
                              sizeUnit="px"
                              size={24}
                              color="#fff"
                            />
                          ) : 'Submit'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={this.deleteOrder}
                        >
                          {'Delete'}
                        </button>
                      </div>
                    </form>
                  )}
                </Mutation>
              </div>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

AddtoOrder.propTypes = {
  dataProduct: PropTypes.shape({
    productId: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.shape({
      categoryId: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
    })),
    price: PropTypes.number,
    quantity: PropTypes.number,
    createdDate: PropTypes.string,
    modifiedDate: PropTypes.string,
  }).isRequired,
  self: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddtoOrder;
