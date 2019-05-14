import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';
import Select from 'react-select';
import _ from 'lodash';

const override = css`
    display: block;
    margin: 0 auto;
`;
const GET_ROLES = gql`
  {
    getRoles{
      roleId
      name
      description
      level
    }
  }
`;
const UPDATESELF_QUERY = gql`
  mutation UpdateSelf($user: UserInput, $newPassword: String!, $base64String: String!) {
    updateSelf(user: $user, newPassword: $newPassword, base64String:$base64String){
      userId
      name
      email
      password
      avatar
      roles{
        roleId
        name
        level
        createdDate
        modifiedDate
      }
      superiorId
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

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    const { dataUser } = this.props;
    this.state = {
      editable: false,
      dataUser,
      newPassword: '',
      base64String: '',
    };
    // This binding is necessary to make `this` work in the callback
    this.editableToggle = this.editableToggle.bind(this);
    this.commonChange = this.commonChange.bind(this);
    this.userChange = this.userChange.bind(this);
    this.imgChange = this.imgChange.bind(this);
    this.roleChange = this.roleChange.bind(this);
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

  userChange(event) {
    const { dataUser } = this.state;
    dataUser[event.target.name] = event.target.value;
    this.setState({
      dataUser,
    });
  }

  roleChange(value) {
    const { dataUser } = this.state;
    dataUser.roles = [];
    value.forEach((e) => {
      dataUser.roles.push(e.data);
    });
    this.setState({
      dataUser,
    });
  }

  render() {
    const {
      editable, dataUser, newPassword, base64String,
    } = this.state;
    const { getUser, user, edit } = this.props;
    return (
      <Mutation mutation={UPDATESELF_QUERY} errorPolicy="ignore" onCompleted={() => { getUser(); }}>
        {(updateSelf, { loading, error }) => (
          <form
            className="card"
            onSubmit={(e) => {
              e.preventDefault();
              updateSelf({ variables: { user: dataUser, newPassword, base64String } });
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
                    onChange={this.userChange}
                    readOnly={!editable}
                    value={dataUser.name}
                  />
                </div>
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="email" style={{ width: '100%' }}>
                <div className="col-sm-3 control-label">Email</div>
                <div className="col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={this.userChange}
                    readOnly
                    value={dataUser.email}
                  />
                </div>
              </label>
            </div>
            <Query query={GET_ROLES}>
              {({ loading: loading1, data }) => {
                if (loading1) return '';
                const options = [];
                const selectedOptions = [];
                data.getRoles.forEach((role) => {
                  options.push({ data: role, label: role.name, value: role.name });
                });
                dataUser.roles.forEach((role) => {
                  selectedOptions.push({ data: role, label: role.name, value: role.name });
                });
                return (
                  <div className="form-group">
                    <label htmlFor="roles" style={{ width: '100%' }}>
                      <div className="col-sm-3 control-label">Roles</div>
                      <div className="col-sm-10">
                        {/* bypass eslint label */}
                        <input name="roles" hidden />
                        <Select
                          isMulti
                          isDisabled={_.find(user.roles, { name: 'Admin' }) !== undefined ? !editable : true}
                          defaultValue={selectedOptions}
                          onChange={this.roleChange}
                          options={options}
                          name="roles"
                          id="roles"
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                    </label>
                  </div>
                );
              }}
            </Query>
            {
              edit ? (
                <div>
                  {editable ? (
                    <div>
                      <div className="form-group">
                        <label htmlFor="avatar" style={{ width: '100%' }}>
                          <div className="col-sm-3 control-label">New Avatar</div>
                          <div className="col-sm-10">
                            <input
                              type="file"
                              className="form-control"
                              id="avatar"
                              name="avatar"
                              onChange={this.imgChange}
                              readOnly={!editable}
                            />
                          </div>
                        </label>
                      </div>
                      {user.userId === dataUser.userId ? (
                        <div className="form-group">
                          <label htmlFor="newPassword" style={{ width: '100%' }}>
                            <div className="col-sm-3 control-label">New Password</div>
                            <div className="col-sm-10">
                              <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                name="newPassword"
                                placeholder="Password"
                                onChange={this.commonChange}
                                readOnly={!editable}
                              />
                            </div>
                          </label>
                        </div>
                      ) : ''}
                      <br />
                      {error && error.graphQLErrors.map(({ message }, i) => (
                        <span className="text-danger" key={i.toString()}>{message}</span>
                      ))}
                      <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                          <button type="submit" id="login-btn" className="btn btn-primary">
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
                    </div>
                  ) : (
                    <div className="form-group">
                      <div className="col-sm-offset-2 col-sm-10">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => this.editableToggle()}
                        >
                      Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : ''
            }
          </form>
        )}
      </Mutation>
    );
  }
}

UserDetail.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
  dataUser: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
  getUser: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default UserDetail;
