import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SidebarBrand from './SidebarBrand';
import SidebarMenu from './SidebarMenu';

const Sidebar = ({ sidebarOpen, user }) => (
  <aside className="main-sidebar sidebar-dark-primary elevation-4">
    <SidebarBrand sidebarOpen={sidebarOpen} />
    <div className="sidebar">
      <Link to="/me" className="user-panel mt-3 mb-3 d-flex">
        <div style={{ margin: 'auto', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div className="image" style={{ float: 'none' }}>
            <img src={`/images/${user && user.avatar}`} className="img-circle elevation-2" alt="User" />
          </div>
          <div className="info">
            <p className="d-block" style={{ marginLeft: '5px' }}>{user && user.name}</p>
          </div>
        </div>
      </Link>
      <SidebarMenu />
    </div>
  </aside>
);

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
};
export default Sidebar;
