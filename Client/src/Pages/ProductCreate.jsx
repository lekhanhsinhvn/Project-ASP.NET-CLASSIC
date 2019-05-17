import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';
import Select from 'react-select';

import ContentHeader from '../Components/ContentHeader';

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
const CREATEPRODUCT_QUERY = gql`
  mutation CreateProduct($product: ProductInput, $base64String: String!) {
    createProduct(product: $product, base64String:$base64String){
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
class ProductCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProduct: {
        // productId: 0,
        name: '',
        description: '',
        // image: 'default',
        categories: [],
        price: 0,
        quantity: 0,
        // createdDate: '',
        // modifiedDate: '',
      },
      base64String: '',
    };
    // This binding is necessary to make `this` work in the callback
    this.commonChange = this.commonChange.bind(this);
    this.productChange = this.productChange.bind(this);
    this.imgChange = this.imgChange.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
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
    const { dataProduct, base64String } = this.state;
    const {
      header, history,
    } = this.props;
    return (
      <div style={{ minHeight: '511px' }}>
        <ContentHeader header={header} />
        <section className="content">
          <div className="container-fluid">
            <Mutation mutation={CREATEPRODUCT_QUERY} errorPolicy="ignore" onCompleted={() => { history.push('/products'); }}>
              {(createProduct, { loading, error }) => (
                <form
                  className="card"
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log(dataProduct);
                    createProduct({ variables: { product: dataProduct, base64String } });
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
                          required
                          onChange={this.productChange}
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
                        />
                      </div>
                    </label>
                  </div>
                  <Query query={GET_CATEGORIES}>
                    {({ loading: loading1, data }) => {
                      if (loading1) return '';
                      const options = [];
                      data.getCategories.forEach((category) => {
                        options.push({
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
                          required
                          onChange={this.productChange}
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
                          required
                          onChange={this.productChange}
                        />
                      </div>
                    </label>
                  </div>
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
                    </div>
                  </div>
                </form>
              )}
            </Mutation>
          </div>
        </section>
      </div>
    );
  }
}
ProductCreate.propTypes = {
  header: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};
export default ProductCreate;
