import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SidebarBrand = ({ sidebarOpen }) => (
  <Link to="/" className="brand-link" style={{ textAlign: 'center' }}>
    <span className="brand-text">
      <b>{sidebarOpen ? 'Admin' : 'A'}</b>
      {'LTE'}
    </span>
  </Link>
);


SidebarBrand.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
};
export default SidebarBrand;
