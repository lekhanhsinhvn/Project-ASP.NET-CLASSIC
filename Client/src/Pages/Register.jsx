import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';


const override = css`
    display: block;
    margin: 0 auto;
`;
const CREATEUSER_QUERY = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user:$user){
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
      createdDate
      modifiedDate
      }
  }
`;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      cfpwd: '',
      err: '',
    };

    // This binding is necessary to make `this` work in the callback
    this.commonChange = this.commonChange.bind(this);
    this.setErr = this.setErr.bind(this);
  }

  setErr(data) {
    this.setState({
      err: data,
    });
  }

  commonChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const {
      name, email, password, cfpwd, err,
    } = this.state;

    return (
      <Mutation mutation={CREATEUSER_QUERY} errorPolicy="ignore">
        {(createUser, { loading, error, data }) => (
          <div className="login-page">
            <div className="login-box">
              <div className="login-logo">
                <Link to="/" className="nav-link">Dashboard</Link>
              </div>
              <form
                className="card"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (cfpwd === password) {
                    this.setErr(null);
                    createUser({
                      variables: {
                        user: {
                          name, email, password,
                        },
                      },
                    });
                  } else {
                    this.setErr('Password not match');
                  }
                }}
              >
                <div className="card-body login-card-body">
                  <h2 className="login-box-msg">Register</h2>
                  <div className="input-group mb-2 mr-sm-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-user" />
                      </div>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Name"
                      required
                      onChange={this.commonChange}
                    />
                  </div>
                  <div className="input-group mb-2 mr-sm-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-envelope" />
                      </div>
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Email"
                      required
                      onChange={this.commonChange}
                    />
                  </div>
                  <div className="input-group mb-2 mr-sm-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-lock" />
                      </div>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Password"
                      required
                      onChange={this.commonChange}
                    />
                  </div>
                  <div className="input-group mb-2 mr-sm-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-lock" />
                      </div>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      id="cfpwd"
                      name="cfpwd"
                      placeholder="Confirm Password"
                      required
                      onChange={this.commonChange}
                    />
                  </div>
                  <div className="row">
                    <div className="col-8">
                      {/* <div className="form-check">
                      <input className="form-check-input" type="checkbox" />
                      <div className="form-check-label">Remember Me</div>
                    </div> */}
                      <div>
                        {err
                          ? (<span className="text-danger">{err}</span>)
                          : (
                            <React.Fragment>
                              {error && error.graphQLErrors.map(({ message }, i) => (
                                <span className="text-danger" key={i.toString()}>{message}</span>
                              ))}
                            </React.Fragment>
                          )}
                        {data && (<Redirect to="/" />)}
                      </div>
                    </div>
                    <div className="col-4">
                      <button type="submit" id="login-btn" className="btn btn-primary btn-block btn-flat ">
                        {loading ? (
                          <BounceLoader
                            css={override}
                            sizeUnit="px"
                            size={24}
                            color="#fff"
                          />
                        ) : 'Register'}

                      </button>
                    </div>
                  </div>
                  <p className="mb-1">
                    {/* <a href="#">I forgot my password</a> */}
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default Register;
