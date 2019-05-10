import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const LOGIN_QUERY = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

class LoginFrom extends React.Component {
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
    const { email, password } = this.state;
    const { getUser } = this.props;
    return (
      <Mutation mutation={LOGIN_QUERY} onCompleted={() => { getUser(); }}>
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
                        {error && error.graphQLErrors.map(({ message }, i) => (
                          <span className="text-danger" key={i.toString()}>{message}</span>
                        ))}
                      </div>
                    </div>
                    <div className="col-4">
                      <button type="submit" id="login-btn" className="btn btn-primary btn-block btn-flat ">
                        {loading ? (
                          <div className="lds-ring">
                            <div />
                            <div />
                            <div />
                            <div />
                          </div>
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

LoginFrom.propTypes = {
  getUser: PropTypes.func.isRequired,
};
export default LoginFrom;
