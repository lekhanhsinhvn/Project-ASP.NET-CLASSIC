import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const LOGOUT_QUERY = gql`
  mutation Logout {
    logout
  }
`;

const LogoutBtn = ({ getUser }) => (
  <div>
    <Mutation mutation={LOGOUT_QUERY} onCompleted={() => { getUser(); }}>
      {logout => (
        <button
          type="button"
          className="btn btn-link nav-link"
          onClick={() => { logout(); }}
        >
        Log out
        </button>
      )}
    </Mutation>
  </div>
);
LogoutBtn.propTypes = {
  getUser: PropTypes.func.isRequired,
};

export default LogoutBtn;
