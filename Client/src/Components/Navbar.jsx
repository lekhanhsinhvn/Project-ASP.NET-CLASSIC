import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import LogoutBtn from './LogoutBtn';

const Navbar = ({ sidebarToggle, setLoaded }) => (
  <div className="main-header navbar navbar-expand bg-white navbar-light border-bottom">
    <ul className="navbar-nav">
      <li className="nav-item">
        <button type="button" className="btn btn-link nav-link" onClick={sidebarToggle}>
          <i className="fas fa-bars" />
        </button>
      </li>
      <li className="nav-item">
        <Link to="/" className="nav-link">Dashboard</Link>
      </li>
    </ul>
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <LogoutBtn setLoaded={setLoaded} />
      </li>
    </ul>
  </div>
);

Navbar.propTypes = {
  sidebarToggle: PropTypes.func.isRequired,
  setLoaded: PropTypes.func.isRequired,
};
export default Navbar;
