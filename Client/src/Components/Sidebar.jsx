import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import ReactResizeDetector from 'react-resize-detector';

import SidebarBrand from './SidebarBrand';
import SidebarMenu from './SidebarMenu';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.reload = this.reload.bind(this);
  }

  // reaload too update Scrollbars when child resize, maybe not the best ideal
  reload() {
    this.setState(prevState => (
      { ...prevState }
    ));
  }

  render() {
    const { sidebarToggle, sidebarOpen, self } = this.props;
    return (
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <button type="button" className="btn btn-link sidebarToggle" onClick={sidebarToggle}>
          <i className="fas fa-bars" />
        </button>
        <SidebarBrand sidebarOpen={sidebarOpen} />
        <ReactResizeDetector handleWidth handleHeight>
          {() => (
            <div className="sidebar">
              <Scrollbars>
                <div>
                  <Link to="/users/me" className="user-panel mt-3 mb-3 d-flex">
                    <div style={{ margin: 'auto', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      <div className="image" style={{ float: 'none' }}>
                        <img src={`/images/${self && self.avatar}`} className="img-circle elevation-2" alt="User" />
                      </div>
                      <div className="info">
                        <p className="d-block" style={{ marginLeft: '5px' }}>{self && self.name}</p>
                      </div>
                    </div>
                  </Link>
                  <SidebarMenu reload={this.reload} self={self} />
                </div>
              </Scrollbars>
            </div>
          )}
        </ReactResizeDetector>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  sidebarToggle: PropTypes.func.isRequired,
  self: PropTypes.shape({
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
