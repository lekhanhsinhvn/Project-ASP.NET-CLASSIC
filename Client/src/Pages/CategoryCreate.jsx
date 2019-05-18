import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import ContentHeader from '../Components/ContentHeader';

const override = css`
      display: block;
      margin: 0 auto;
  `;
const CREATECATEGORY_QUERY = gql`
  mutation CreateCategory($category: CategoryInput) {
    createCategory(category: $category){
        categoryId
        name
        description
        createdDate
        modifiedDate 
    }
  }
`;
class CategoryCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCategory: {
        name: '',
        description: '',
      },
    };
    // This binding is necessary to make `this` work in the callback
    this.categoryChange = this.categoryChange.bind(this);
  }

  categoryChange(event) {
    const { dataCategory } = this.state;
    dataCategory[event.target.name] = event.target.value;
    this.setState({
      dataCategory,
    });
  }

  render() {
    const { dataCategory } = this.state;
    const {
      header, history,
    } = this.props;
    return (
      <div style={{ minHeight: '511px' }}>
        <ContentHeader header={header} />
        <section className="content">
          <div className="container-fluid">
            <Mutation mutation={CREATECATEGORY_QUERY} errorPolicy="ignore" onCompleted={() => { history.push('/categories'); }}>
              {(createCategory, { loading, error }) => (
                <form
                  className="card"
                  onSubmit={(e) => {
                    e.preventDefault();
                    createCategory({ variables: { category: dataCategory } });
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
                          onChange={this.categoryChange}
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
                          onChange={this.categoryChange}
                        />
                      </div>
                    </label>
                  </div>
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
CategoryCreate.propTypes = {
  header: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};
export default CategoryCreate;
