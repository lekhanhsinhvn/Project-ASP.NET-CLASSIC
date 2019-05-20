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
const GETSELFORDERSWITHSTATUS_QUERY = gql`
query GetSelfOrdersWithStatus($userId: Int!,$status: String){
    getSelfOrdersWithStatus(userId: $userId, status: $status){
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
    };
    this.setModal = this.setModal.bind(this);
    this.orderChange = this.orderChange.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.selectOrder = this.selectOrder.bind(this);
  }

  componentDidMount() {
    Modal.setAppElement('#content');
  }

  setModal(modalIsOpen) {
    const { self } = this.props;
    clearStore();
    if (modalIsOpen === true) {
      client.query({ query: GETSELFORDERSWITHSTATUS_QUERY, variables: { userId: self.userId, status: 'Adding' } })
        .then((response) => {
          this.setState(() => (
            {
              modalIsOpen,
              orders: response.data.getSelfOrdersWithStatus,
              currOrder: response.data.getSelfOrdersWithStatus[0],
            }
          ));
        });
    } else {
      this.setState(() => (
        {
          modalIsOpen,
          orders: null,
          currOrder: null,
        }
      ));
    }
  }

  selectOrder(event) {
    const { orders } = this.state;
    this.setState({
      currOrder: orders[event.target.value],
    });
  }

  createOrder() {
    const { self } = this.props;
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
    }).then(() => this.setModal(true));
  }

  deleteOrder() {
    const { currOrder } = this.state;
    client.mutate({
      mutation: DELETEORDER_QUERY,
      variables: {
        orderId: currOrder.orderId,
      },
    }).then(() => this.setModal(true));
  }

  orderChange(event) {
    let { currOrder } = this.state;
    const { dataProduct } = this.props;
    if (currOrder) {
      if (currOrder.orderDetails) {
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
      modalIsOpen, orders, currOrder,
    } = this.state;
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
                <select name="currOrder" className="form-control" onChange={this.selectOrder}>
                  {orders && orders.map((order, index) => (
                    <option value={index} key={order.Id || index}>
                      {`Id: ${order.orderId}`}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="row">
              <div className="col-8">
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
                <button type="button" className="btn btn-link" onClick={() => this.createOrder()}>Create new order</button>
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
                              <label htmlFor="quantity">{`/${dataProduct.quantity}`}</label>
                            </div>
                          </div>
                        </label>
                      </div>
                      <br />
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
                        <button type="button" className="btn btn-danger" onClick={this.deleteOrder}>Delete</button>
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
