import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-boost';
import _ from 'lodash';

import ContentHeader from '../Components/ContentHeader';

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

const GET_TOTALCOUNTCATEGORY = gql`
  {
    getTotalCountCategory
  }
`;
const GET_CATEGORIES = gql`
  query GetCategories($pageNum: Int, $maxPerPage: Int, $search: String, $sort: String, $asc: Boolean){
    getCategories(pageNum: $pageNum, maxPerPage: $maxPerPage, search: $search, sort: $sort, asc: $asc) {
      categoryId
      name
      description
      createdDate
      modifiedDate 
      }
  }
`;

let sortting = 'Name';
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

class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.state = {
      categories: null,
      totalCountCategory: 0,
    };
    this.redirect = this.redirect.bind(this);
    this.setCategories = this.setCategories.bind(this);
    this.getCategories = this.getCategories.bind(this);
  }

  componentDidMount() {
    const pageNum = getUrlParameter('pageNum') !== null ? parseInt(getUrlParameter('pageNum'), 10) : 0;
    const maxPerPage = getUrlParameter('maxPerPage') !== null ? parseInt(getUrlParameter('maxPerPage'), 10) : 10;
    const search = getUrlParameter('search') !== null ? getUrlParameter('search') : '';
    const sort = getUrlParameter('sort') !== null ? getUrlParameter('sort') : '';
    const asc = getUrlParameter('asc') !== null ? getUrlParameter('asc') : true;
    this.getCategories({
      pageNum, maxPerPage, search, sort, asc,
    });
  }

  componentDidUpdate() {
    const pageNum = getUrlParameter('pageNum') !== null ? parseInt(getUrlParameter('pageNum'), 10) : 0;
    const maxPerPage = getUrlParameter('maxPerPage') !== null ? parseInt(getUrlParameter('maxPerPage'), 10) : 10;
    const search = getUrlParameter('search') !== null ? getUrlParameter('search') : '';
    const sort = getUrlParameter('sort') !== null ? getUrlParameter('sort') : '';
    const asc = getUrlParameter('asc') !== null ? getUrlParameter('asc') : true;
    this.getCategories({
      pageNum, maxPerPage, search, sort, asc,
    });
  }

  setCategories(categories, totalCountCategory) {
    const { categories: categories1 } = this.state;
    if (!_.isEqual(categories1, categories)) {
      this.setState(() => (
        { categories, totalCountCategory }
      ));
    }
  }

  getCategories({
    pageNum, maxPerPage, search, sort, asc,
  }) {
    const { categories } = this.state;
    let dataCategories;
    let dataTotalCountCategory;
    clearStore();
    client.query({
      query: GET_CATEGORIES,
      variables: {
        pageNum, maxPerPage, search, sort, asc,
      },
      errorPolicy: 'ignore',
    })
      .then((response) => {
        dataCategories = response.data.getCategories;
        if (!_.isEqual(categories, dataCategories)) {
          client.query({
            query: GET_TOTALCOUNTCATEGORY,
            errorPolicy: 'ignore',
          }).then((response1 = response) => {
            dataTotalCountCategory = response1.data.getTotalCountProduct;
            this.setCategories(dataCategories, dataTotalCountCategory);
          });
        }
      });
  }

  redirect({
    pageNum, maxPerPage, search, sort, asc,
  }) {
    const { history } = this.props;
    history.push(`/categories?pageNum=${pageNum}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`);
  }

  render() {
    const { header } = this.props;
    const { categories, totalCountCategory } = this.state;
    const pageNum = getUrlParameter('pageNum') !== null ? parseInt(getUrlParameter('pageNum'), 10) : 0;
    const maxPerPage = getUrlParameter('maxPerPage') !== null ? parseInt(getUrlParameter('maxPerPage'), 10) : 10;
    const search = getUrlParameter('search') !== null ? getUrlParameter('search') : '';
    const sort = getUrlParameter('sort') !== null ? getUrlParameter('sort') : '';
    const asc = getUrlParameter('asc') !== null ? getUrlParameter('asc') : true;
    return (
      <div style={{ minHeight: '511px' }}>
        <ContentHeader header={header} />
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
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
                {categories !== null ? (
                  <React.Fragment>
                    <table className="table dataTable table-bordered table-hover">
                      <thead>
                        <tr>
                          <th
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              asccing = sortting === 'CategoryId' ? !asccing : true;
                              sortting = 'CategoryId';
                              this.redirect({
                                pageNum, maxPerPage, search, sort: sortting, asc: asccing,
                              });
                            }}
                          >
                            {'CategoryId'}
                            {sortting === 'CategoryId'
                              ? (<div className="float-right">{asccing ? (<i className="fas fa-arrow-up" />) : <i className="fas fa-arrow-down" />}</div>)
                              : ''}
                          </th>
                          <th
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              asccing = sortting === 'Name' ? !asccing : true;
                              sortting = 'Name';
                              this.redirect({
                                pageNum, maxPerPage, search, sort: sortting, asc: asccing,
                              });
                            }}
                          >
                            {'Name'}
                            {sortting === 'Name'
                              ? (<div className="float-right">{asccing ? (<i className="fas fa-arrow-up" />) : <i className="fas fa-arrow-down" />}</div>)
                              : ''}
                          </th>
                          <th>Description</th>
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
                        </tr>
                      </thead>
                      <tbody>
                        {categories && categories.map((category, index) => (
                          <tr
                            key={category.categoryId || index}
                          >
                            <td>{category.categoryId}</td>
                            <td>
                              <Link to={`/categories/detail?CategoryId=${category.categoryId}`}>
                                {category.name}
                              </Link>
                            </td>
                            <td>{category.price}</td>
                            <td>{category.createdDate}</td>
                            <td>{category.modifiedDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {totalCountCategory !== null ? (
                      <div className="row">
                        <div className="col-sm-12 col-md-5">
                          <div className="dataTables_info">
                            {`Showing ${pageNum * maxPerPage + 1} to ${((pageNum + 1) * maxPerPage > totalCountCategory) ? totalCountCategory : (pageNum + 1) * maxPerPage} of ${totalCountCategory} entries`}
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-7">
                          <div className="dataTables_paginate paging_simple_numbers">
                            <ul className="pagination">
                              <li className={`paginate_button page-item ${pageNum - 1 >= 0 ? '' : 'disabled'}`}>
                                {pageNum - 1 >= 0
                                  ? (<Link className="page-link" to={`/categories?pageNum=${pageNum - 1}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>Previous</Link>)
                                  : (<div className="page-link">Previous</div>)}
                              </li>
                              <li className="paginate_button page-item">
                                {pageNum - 2 >= 0
                                  ? (<Link className="page-link" to={`/categories?pageNum=${pageNum - 2}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>{pageNum - 2}</Link>)
                                  : ''}
                              </li>
                              <li className="paginate_button page-item">
                                {pageNum - 1 >= 0
                                  ? (<Link className="page-link" to={`/categories?pageNum=${pageNum - 1}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>{pageNum - 1}</Link>)
                                  : ''}
                              </li>
                              <li className="paginate_button page-item active disabled">
                                <div className="page-link">{pageNum}</div>
                              </li>
                              <li className="paginate_button page-item">
                                {(pageNum + 1) * maxPerPage < totalCountCategory
                                  ? (<Link className="page-link" to={`/categories?pageNum=${pageNum + 1}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>{pageNum + 1}</Link>)
                                  : ''}
                              </li>
                              <li className="paginate_button page-item">
                                {(pageNum + 2) * maxPerPage < totalCountCategory
                                  ? (<Link className="page-link" to={`/categories?pageNum=${pageNum + 2}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>{pageNum + 2}</Link>)
                                  : ''}
                              </li>
                              <li className={`paginate_button page-item ${(pageNum + 1) * maxPerPage < totalCountCategory ? '' : 'disabled'}`}>
                                {(pageNum + 1) * maxPerPage < totalCountCategory
                                  ? (<Link className="page-link" to={`/categories?pageNum=${pageNum + 1}&maxPerPage=${maxPerPage}&search=${search}&sort=${sort}&asc=${asc}`}>Next</Link>)
                                  : (<div className="page-link">Next</div>)}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : ''}
                  </React.Fragment>
                ) : 'No result'}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

CategoryList.propTypes = {
  header: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default CategoryList;
