import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';
import Select from 'react-select';
import _ from 'lodash';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include',
});

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
const UPDATEUSER_QUERY = gql`
  mutation UpdateUser($user: UserInput, $base64String: String!) {
    updateUser(user: $user, base64String:$base64String){
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
const DELETEUSER_QUERY = gql`
  mutation DeleteUser($userId:Int!) {
    deleteUser(userId: $userId){
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

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    const { dataUser } = this.props;
    this.state = {
      editable: false,
      dataUser,
      base64String: '',
      err: null,
    };
    // This binding is necessary to make `this` work in the callback
    this.editableToggle = this.editableToggle.bind(this);
    this.commonChange = this.commonChange.bind(this);
    this.userChange = this.userChange.bind(this);
    this.imgChange = this.imgChange.bind(this);
    this.roleChange = this.roleChange.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.setErr = this.setErr.bind(this);
  }

  setErr(data) {
    const data1 = data.replace('GraphQL error:', '');
    this.setState(() => ({
      err: data1,
    }));
  }

  deleteUser() {
    const { dataUser } = this.state;
    const { history } = this.props;
    if (dataUser) {
      client.mutate({
        mutation: DELETEUSER_QUERY,
        variables: { userId: parseInt(dataUser.userId, 10) },
      }).then(() => history.push('/users'), (e) => { this.setErr(e.message); });
    }
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
      editable, dataUser, base64String, err,
    } = this.state;
    const {
      getSelf, self, edit, refetch,
    } = this.props;
    return (
      <Mutation
        mutation={UPDATEUSER_QUERY}
        errorPolicy="ignore"
        onCompleted={() => {
          if (dataUser.userId === self.userId) {
            getSelf();
          } else {
            refetch();
            this.editableToggle();
          }
        }}
      >
        {(updateUser, { loading, error }) => (
          <form
            className="card"
            onSubmit={(e) => {
              e.preventDefault();
              dataUser.superiorId = parseInt(dataUser.superiorId, 10);
              updateUser({ variables: { user: dataUser, base64String } });
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
                    required
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
            <div className="form-group">
              <label htmlFor="superiorId" style={{ width: '100%' }}>
                <div className="col-sm-3 control-label">SuperiorId</div>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    id="superiorId"
                    name="superiorId"
                    placeholder="SuperiorId"
                    onChange={this.userChange}
                    readOnly={!editable}
                    value={dataUser.superiorId}
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
                        <Select
                          isMulti
                          isDisabled={(_.find(self.roles, { name: 'Admin' }) !== undefined && dataUser.userId !== self.userId) ? !editable : true}
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
              (edit && (_.find(self.roles, { name: 'Admin' }) !== undefined)) ? (
                <React.Fragment>
                  {editable ? (
                    <React.Fragment>
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
                      <br />
                      {err && <span className="text-danger">{err}</span>}
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
                          {self.userId !== dataUser.userId ? (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => this.deleteUser()}
                            >
                              {'Delete'}
                            </button>
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
    );
  }
}

UserForm.propTypes = {
  self: PropTypes.shape({
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
    superiorId: PropTypes.number,
  }).isRequired,
  getSelf: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default UserForm;
