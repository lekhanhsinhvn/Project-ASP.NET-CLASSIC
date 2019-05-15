import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// list children of node
function getChildren(node) {
  let { children } = node;
  if (!_.isArray(children)) {
    children = children ? [children] : [];
  }
  return children;
}

class SidebarMenuNode extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.renderButton = this.renderButton.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
  }

  renderButton() {
    let button;
    const { node, reload } = this.props;
    if (getChildren(node).length < 1) {
      button = (
        <Link to={node.path} className={`nav-link ${(window.location.pathname === node.path && node.path !== '/') || (window.location.pathname === '/' && node.path === '/') ? 'active' : ''}`}>
          <i className={`nav-icon ${node.icon}`} />
          <p>{node.name}</p>
        </Link>
      );
    } else {
      button = (
        <button type="button" className={`btn btn-link nav-link ${(window.location.pathname.startsWith(node.path) && node.path !== '/') || (window.location.pathname === '/' && node.path === '/') ? 'active' : ''}`} onClick={() => { setTimeout(() => { reload(); }, 600); }}>
          <i className={`nav-icon ${node.icon}`} />
          <p>
            {node.name}
            <i className="right fas fa-angle-left" />
          </p>
        </button>
      );
    }
    return button;
  }

  renderChildren() {
    const { node, reload } = this.props;
    let childrenRendered;
    if (getChildren(node).length >= 1) {
      childrenRendered = getChildren(node).map((child, index) => (
        <SidebarMenuNode key={child.id || index} node={child} reload={reload} />
      ));
      childrenRendered = (<ul className="nav nav-treeview">{childrenRendered}</ul>);
    }
    return childrenRendered;
  }

  render() {
    const { node } = this.props;
    return (
      <li className={`nav-item ${getChildren(node).length >= 1 ? 'has-treeview' : ''}`}>
        {this.renderButton()}
        {this.renderChildren()}
      </li>
    );
  }
}

SidebarMenuNode.propTypes = {
  node: PropTypes.shape({
    name: PropTypes.string,
    path: PropTypes.string,
    class: PropTypes.string,
    children: PropTypes.array,
  }).isRequired,
  reload: PropTypes.func.isRequired,
};
export default SidebarMenuNode;
