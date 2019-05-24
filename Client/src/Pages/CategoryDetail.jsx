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
const UPDATECATEGORY_QUERY = gql`
  mutation UpdateCategory($category: CategoryInput) {
    updateCategory(category: $category){
        categoryId
        name
        description
    }
  }
`;
const DELETECATEGORY_QUERY = gql`
  mutation DeleteCategory($categoryId:Int!) {
    deleteCategory(categoryId: $categoryId){
        categoryId
        name
        description
        createdDate
        modifiedDate 
    }
  }
`;
class CategoryDetail extends React.Component {
  constructor(props) {
    super(props);
    const { dataCategory } = this.props;
    this.state = {
      editable: false,
      dataCategory,
    };
    // This binding is necessary to make `this` work in the callback
    this.editableToggle = this.editableToggle.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  componentWillMount() {
    const { refetch } = this.props;
    refetch();
  }

  editableToggle() {
    this.setState(prevState => (
      { editable: !prevState.editable }
    ));
  }

  categoryChange(event) {
    const { dataCategory } = this.state;
    dataCategory[event.target.name] = event.target.value;
    this.setState({
      dataCategory,
    });
  }

  deleteCategory() {
    const { dataCategory, history } = this.props;
    client.mutate({
      mutation: DELETECATEGORY_QUERY,
      variables: { categoryId: parseInt(dataCategory.categoryId, 10) },
      errorPolicy: 'ignore',
    }).then(() => history.push('/categories'));
  }

  render() {
    const {
      editable, dataCategory,
    } = this.state;
    const { header, edit, refetch } = this.props;
    return (
      <div style={{ minHeight: '511px' }}>
        <ContentHeader header={header} />
        <section className="content">
          <div className="container-fluid">
            <Mutation mutation={UPDATECATEGORY_QUERY} errorPolicy="ignore" onCompleted={() => { refetch(); this.editableToggle(); }}>
              {(updateCategory, { loading, error }) => (
                <form
                  className="card"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateCategory({ variables: { category: dataCategory } });
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
                          readOnly
                          onChange={this.categoryChange}
                          value={dataCategory.name}
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
                          readOnly={!editable}
                          onChange={this.categoryChange}
                          value={dataCategory.description}
                        />
                      </div>
                    </label>
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
                                onClick={() => this.deleteCategory()}
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
          </div>
        </section>
      </div>
    );
  }
}
CategoryDetail.propTypes = {
  dataCategory: PropTypes.shape({
    categoryId: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    createdDate: PropTypes.string,
    modifiedDate: PropTypes.string,
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
};
export default CategoryDetail;
