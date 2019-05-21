import React from 'react';
import PropTypes from 'prop-types';
import SidebarMenuNode from './SidebarMenuNode';
import Treeview from '../js/Treeview';

const data = [
  {
    id: '1',
    path: '/',
    name: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
  },
  {
    id: '2',
    path: '/users',
    name: 'Users',
    icon: 'fas fa-user',
    children: [
      {
        id: '2-1',
        path: '/users/superior',
        name: 'Superior',
        icon: 'far fa-user',
      },
      {
        id: '2-2',
        path: '/users',
        name: 'Users List',
        icon: 'far fa-user',
      },
    ],
  },
  {
    id: '3',
    path: '/orders',
    name: 'Orders',
    icon: 'fas fa-list',
    children: [
      {
        id: '3-1',
        path: '/orders/superior',
        name: 'Superior Order List',
        icon: 'fas fa-list',
      },
      {
        id: '3-2',
        path: '/orders/inferior',
        name: 'Inferior Order List',
        icon: 'fas fa-list',
      },
    ],
  },
  {
    id: '4',
    path: '/products',
    name: 'Products',
    icon: 'fas fa-cubes',
    children: [
      {
        id: '4-1',
        path: '/products',
        name: 'Product List',
        icon: 'fas fa-cubes',
      },
      {
        id: '4-2',
        path: '/products/create',
        name: 'Create Product',
        icon: 'fas fa-cubes',
      },
    ],
  },
  {
    id: '5',
    path: '/categories',
    name: 'Categories',
    icon: 'fas fa-list',
    children: [
      {
        id: '5-1',
        path: '/categories',
        name: 'Category List',
        icon: 'fas fa-list',
      },
      {
        id: '5-2',
        path: '/categories/create',
        name: 'Create Category',
        icon: 'fas fa-list',
      },
    ],
  },
];
class SidebarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: data,
    };
    // This binding is necessary to make `this` work in the callback
    // this.treeViewToggle = this.treeViewToggle.bind(this);
  }

  componentDidMount() {
    Treeview.addEvent();
  }

  render() {
    const { reload } = this.props;
    const { nodes } = this.state;
    const nodesRendered = nodes.map((node, index) => (
      <SidebarMenuNode
        key={node.id || index}
        node={node}
        reload={reload}
      />
    ));
    return (
      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          { nodesRendered }
        </ul>
      </nav>
    );
  }
}
SidebarMenu.propTypes = {
  reload: PropTypes.func.isRequired,
};
export default SidebarMenu;
