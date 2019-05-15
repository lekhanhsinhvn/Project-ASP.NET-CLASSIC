import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 0 auto;
`;
const LOGIN_QUERY = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };

    // This binding is necessary to make `this` work in the callback
    this.commonChange = this.commonChange.bind(this);
  }

  commonChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { getSelf } = this.props;
    const { email, password } = this.state;

    return (
      <Mutation mutation={LOGIN_QUERY} errorPolicy="none" onCompleted={() => { getSelf(); }}>
        {(login, { loading, error }) => (
          <div className="login-page">
            <div className="login-box">
              <div className="login-logo">
                <Link to="/" className="nav-link">Dashboard</Link>
              </div>
              <form
                className="card"
                onSubmit={(e) => {
                  e.preventDefault();
                  login({ variables: { email, password } });
                }}
              >
                <div className="card-body login-card-body">
                  <h2 className="login-box-msg">Sign in</h2>
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
                  <div className="row">
                    <div className="col-8">
                      <Link to="/register">Register</Link>
                      <div>
                        {error && error.graphQLErrors.map(({ message }, i) => (
                          <span className="text-danger" key={i.toString()}>{message}</span>
                        ))}
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
                        ) : 'Sign In'}

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

Login.propTypes = {
  getSelf: PropTypes.func.isRequired,
};
export default Login;
