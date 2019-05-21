import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';
import ApolloClient from 'apollo-boost';

import ContentHeader from '../Components/ContentHeader';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include',
});
const override = css`
      display: block;
      margin: 0 auto;
  `;
const UPDATEORDER_QUERY = gql`
  mutation UpdateOrder($order: OrderInput){
      updateOrder(order:$order){
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
const DELETEORDER_QUERY = gql`
  mutation DeleteOrder($orderId: Int!){
      deleteOrder(orderId:$orderId){
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
class OrderDetail extends React.Component {
  constructor(props) {
    super(props);
    const { dataOrder } = this.props;
    this.state = {
      editable: false,
      dataOrder,
    };
    // This binding is necessary to make `this` work in the callback
    this.editableToggle = this.editableToggle.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
  }

  editableToggle() {
    this.setState(prevState => (
      { editable: !prevState.editable }
    ));
  }

  deleteOrder() {
    const { dataOrder, history } = this.props;
    client.mutate({
      mutation: DELETEORDER_QUERY,
      variables: {
        orderId: dataOrder.orderId,
      },
    }).then(() => history.push('/orders'));
  }

  render() {
    const {
      editable, dataOrder,
    } = this.state;
    const { header, refetch, self } = this.props;
    const edit = (self.userId === dataOrder.inferior.userId && dataOrder.status === 'Adding')
                || (self.userId === dataOrder.superior.userId);
    return (
      <div style={{ minHeight: '511px' }}>
        <ContentHeader header={header} />
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3">
                <div className="card card-primary card-outline">
                  <div className="card-body box-profile">
                    <h3 className="profile-username text-center">Superior</h3>
                    <div className="text-center">
                      <img className="profile-user-img img-fluid img-circle" src={`/images/${dataOrder && dataOrder.superior.avatar}`} alt="User profile" />
                    </div>
                    <h3 className="profile-username text-center">{dataOrder && dataOrder.superior.name}</h3>
                    <ul className="list-group list-group-unbordered mb-3">
                      <li className="list-group-item">
                        <b>Email</b>
                        <div className="float-right">{dataOrder && dataOrder.superior.email}</div>
                      </li>
                      <li className="list-group-item">
                        <b>Roles</b>
                        <div className="float-right">
                          {dataOrder && dataOrder.superior.roles.map((role, index) => (
                            <React.Fragment key={role.roleId || index}>
                              {`${role.name}, `}
                            </React.Fragment>
                          ))}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card card-primary card-outline">
                  <div className="card-body box-profile">
                    <h3 className="profile-username text-center">Inferior</h3>
                    <div className="text-center">
                      <img className="profile-user-img img-fluid img-circle" src={`/images/${dataOrder && dataOrder.inferior.avatar}`} alt="User profile" />
                    </div>
                    <h3 className="profile-username text-center">{dataOrder && dataOrder.inferior.name}</h3>
                    <ul className="list-group list-group-unbordered mb-3">
                      <li className="list-group-item">
                        <b>Email</b>
                        <div className="float-right">{dataOrder && dataOrder.inferior.email}</div>
                      </li>
                      <li className="list-group-item">
                        <b>Roles</b>
                        <div className="float-right">
                          {dataOrder && dataOrder.inferior.roles.map((role, index) => (
                            <React.Fragment key={role.roleId || index}>
                              {`${role.name}, `}
                            </React.Fragment>
                          ))}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <Mutation mutation={UPDATEORDER_QUERY} errorPolicy="ignore" onCompleted={() => { refetch(); this.editableToggle(); }}>
                  {(updateOrder, { loading, error }) => (
                    <form
                      style={{ minHeight: '411px' }}
                      className="card"
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateOrder({ variables: { order: dataOrder } });
                      }}
                    >
                      <div style={{ overflow: 'auto', maxHeight: '350px' }}>
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
                            {dataOrder && dataOrder.orderDetails
                                && dataOrder.orderDetails.map((orderDetail, index) => (
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
                      {error && error.graphQLErrors.map(({ message }, i) => (
                        <span className="text-danger" key={i.toString()}>{message}</span>
                      ))}
                      {edit ? (
                        <React.Fragment>
                          {editable ? (
                            <React.Fragment>
                              <br />
                              {error && error.graphQLErrors.map(({ message }, i) => (
                                <span className="text-danger" key={i.toString()}>{message}</span>
                              ))}
                              <div className="form-group">
                                <div className="col-sm-offset-2 col-sm-10">
                                  <button
                                    type="submit"
                                    id="login-btn"
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
                                    onClick={() => this.deleteOrder()}
                                  >
                                    {'Delete'}
                                  </button>
                                  { (self.userId === dataOrder.inferior.userId && dataOrder.status === 'Adding') ? (
                                    <div className="float-right">
                                      <button
                                        type="button"
                                        id="login-btn"
                                        className="btn btn-success"
                                        onClick={() => {
                                          dataOrder.status = 'Processing';
                                          updateOrder({ variables: { order: dataOrder } });
                                        }}
                                      >
                                        {loading ? (
                                          <BounceLoader
                                            css={override}
                                            sizeUnit="px"
                                            size={24}
                                            color="#fff"
                                          />
                                        ) : 'Send'}
                                      </button>
                                    </div>
                                  ) : ''}

                                </div>
                              </div>
                            </React.Fragment>
                          ) : (
                            <div className="form-group">
                              <div className="col-sm-offset-2 col-sm-10">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => this.editableToggle()}
                                >
                                  {'Edit'}
                                </button>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ) : ''}
                    </form>
                  )}
                </Mutation>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
OrderDetail.propTypes = {
  self: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
  dataOrder: PropTypes.shape({
    orderId: PropTypes.number,
    orderDetails: PropTypes.arrayOf(PropTypes.shape({
      product: PropTypes.shape({
        productId: PropTypes.number,
        name: PropTypes.string,
        image: PropTypes.string,
      }),
      quantity: PropTypes.number,
      unitPrice: PropTypes.number,
    })),
    superior: PropTypes.shape({
      userId: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
      avatar: PropTypes.string,
      roles: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
      })),
    }),
    inferior: PropTypes.shape({
      userId: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
      avatar: PropTypes.string,
      roles: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
      })),
    }),
    createdDate: PropTypes.string,
    modifiedDate: PropTypes.string,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
};
export default OrderDetail;
