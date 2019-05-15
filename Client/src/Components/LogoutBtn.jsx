import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const LOGOUT_QUERY = gql`
  mutation Logout {
    logout
  }
`;

const LogoutBtn = ({ getSelf }) => (
  <div>
    <Mutation mutation={LOGOUT_QUERY} onCompleted={() => { getSelf(); }}>
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
  getSelf: PropTypes.func.isRequired,
};

export default LogoutBtn;
