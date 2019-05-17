import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';
import Select from 'react-select';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include',
});

const override = css`
      display: block;
      margin: 0 auto;
  `;
const GET_CATEGORIES = gql`
  {
    getCategories{
      categoryId
      name
      description
    }
  }
`;
const UPDATEPRODUCT_QUERY = gql`
  mutation UpdateProduct($product: ProductInput, $base64String: String!) {
    updateProduct(product: $product, base64String:$base64String){
        productId
        name
        description
        image
        categories{
          categoryId
          name
          description
        }
        price
        quantity
        createdDate
        modifiedDate 
    }
  }
`;
const DELETEPRODUCT_QUERY = gql`
  mutation DeleteProduct($productId:Int!) {
    deleteProduct(productId: $productId){
        productId
        name
        description
        image
        categories{
          categoryId
          name
          description
        }
        price
        quantity
        createdDate
        modifiedDate 
    }
  }
`;
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    const { dataProduct } = this.props;
    this.state = {
      editable: false,
      dataProduct,
      base64String: '',
    };
    // This binding is necessary to make `this` work in the callback
    this.editableToggle = this.editableToggle.bind(this);
    this.commonChange = this.commonChange.bind(this);
    this.productChange = this.productChange.bind(this);
    this.imgChange = this.imgChange.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  deleteProduct() {
    const { dataProduct, history } = this.props;
    client.mutate({
      mutation: DELETEPRODUCT_QUERY,
      variables: { productId: parseInt(dataProduct.productId, 10) },
      errorPolicy: 'ignore',
    }).then(() => history.push('/products'));
  }

  editableToggle() {
    this.setState(prevState => (
      { editable: !prevState.editable }
    ));
  }

  commonChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  imgChange(event) {
    if (event.target.files[0]) {
      getBase64(event.target.files[0]).then(
        (data) => {
          this.setState({
            base64String: data,
          });
        },
      );
    } else {
      this.setState({
        base64String: '',
      });
    }
  }

  productChange(event) {
    const { dataProduct } = this.state;
    dataProduct[event.target.name] = event.target.value;
    this.setState({
      dataProduct,
    });
  }

  categoryChange(value) {
    const { dataProduct } = this.state;
    dataProduct.categories = [];
    value.forEach((e) => {
      dataProduct.categories.push(e.data);
    });
    this.setState({
      dataProduct,
    });
  }

  render() {
    const {
      editable, dataProduct, base64String,
    } = this.state;
    const { edit, refetch } = this.props;
    return (
      <Mutation mutation={UPDATEPRODUCT_QUERY} errorPolicy="ignore" onCompleted={() => { refetch(); this.editableToggle(); }}>
        {(updateProduct, { loading, error }) => (
          <form
            className="card"
            onSubmit={(e) => {
              e.preventDefault();
              updateProduct({ variables: { product: dataProduct, base64String } });
            }}
          >
            <div className="form-group">
              <label htmlFor="name" style={{ width: '100%' }}>
                <div className="col-sm-3 control-label">Name</div>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Name"
                    onChange={this.productChange}
                    readOnly
                    value={dataProduct.name}
                  />
                </div>
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="description" style={{ width: '100%' }}>
                <div className="col-sm-3 control-label">Description</div>
                <div className="col-sm-10">
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    placeholder="Description"
                    onChange={this.productChange}
                    readOnly={!editable}
                    value={dataProduct.description !== null ? dataProduct.description : ''}
                  />
                </div>
              </label>
            </div>
            <Query query={GET_CATEGORIES}>
              {({ loading: loading1, data }) => {
                if (loading1) return '';
                const options = [];
                const selectedOptions = [];
                data.getCategories.forEach((category) => {
                  options.push({ data: category, label: category.name, value: category.name });
                });
                dataProduct.categories.forEach((category) => {
                  selectedOptions.push({
                    data: category,
                    label: category.name,
                    value: category.name,
                  });
                });
                return (
                  <div className="form-group">
                    <label htmlFor="categories" style={{ width: '100%' }}>
                      <div className="col-sm-3 control-label">Categories</div>
                      <div className="col-sm-10">
                        <Select
                          isMulti
                          isDisabled={!editable}
                          defaultValue={selectedOptions}
                          onChange={this.categoryChange}
                          options={options}
                          name="categories"
                          id="categories"
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                    </label>
                  </div>
                );
              }}
            </Query>
            <div className="form-group">
              <label htmlFor="price" style={{ width: '100%' }}>
                <div className="col-sm-3 control-label">Price</div>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    placeholder="Price"
                    onChange={this.productChange}
                    readOnly={!editable}
                    required
                    value={dataProduct.price}
                  />
                </div>
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="quantity" style={{ width: '100%' }}>
                <div className="col-sm-3 control-label">Quantity</div>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    name="quantity"
                    placeholder="Quantity"
                    onChange={this.productChange}
                    readOnly={!editable}
                    required
                    value={dataProduct.quantity}
                  />
                </div>
              </label>
            </div>
            {edit ? (
              <React.Fragment>
                {editable ? (
                  <React.Fragment>
                    <div className="form-group">
                      <label htmlFor="image" style={{ width: '100%' }}>
                        <div className="col-sm-3 control-label">New Image</div>
                        <div className="col-sm-10">
                          <input
                            type="file"
                            className="form-control"
                            id="image"
                            name="image"
                            onChange={this.imgChange}
                            readOnly={!editable}
                          />
                        </div>
                      </label>
                    </div>
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
                          onClick={() => this.deleteProduct()}
                        >
                          {'Delete'}
                        </button>
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
    );
  }
}

ProductForm.propTypes = {
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
  edit: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};


export default ProductForm;
