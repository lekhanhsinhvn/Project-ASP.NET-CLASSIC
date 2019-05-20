import React from 'react';
import PropTypes from 'prop-types';

import ContentHeader from '../Components/ContentHeader';
import ProductForm from '../Components/ProductForm';
import AddtoOrder from '../Components/AddtoOrder';


class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      header, dataProduct, edit, refetch, self,
    } = this.props;
    return (
      <div style={{ minHeight: '511px' }}>
        <ContentHeader header={header} />
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-9">
                <ProductForm
                  {...this.props}
                  dataProduct={dataProduct}
                  edit={edit}
                  refetch={refetch}
                />
              </div>
              <div className="col-md-3">
                <div className="card card-primary card-outline">
                  <div className="card-body box-profile">
                    <div className="text-center">
                      <img className="profile-user-img img-fluid" src={`/images/${dataProduct.image}`} alt="Product" />
                    </div>
                    <h3 className="profile-username text-center">{dataProduct.name}</h3>
                    <ul className="list-group list-group-unbordered mb-3">
                      <li className="list-group-item">
                        <b>Price</b>
                        <div className="float-right">{dataProduct.price}</div>
                      </li>
                      <li className="list-group-item">
                        <b>Quantity</b>
                        <div className="float-right">{dataProduct.quantity}</div>
                      </li>
                      <li className="list-group-item">
                        <b>Created</b>
                        <div className="float-right">{dataProduct.createdDate}</div>
                      </li>
                      <li className="list-group-item">
                        <b>Modified</b>
                        <div className="float-right">{dataProduct.modifiedDate}</div>
                      </li>
                    </ul>
                    <AddtoOrder dataProduct={dataProduct} self={self} refresh={refetch} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
ProductDetail.propTypes = {
  self: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
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
  header: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
};
export default ProductDetail;
