import React from 'react';
import SidebarMenuNode from './SidebarMenuNode';
import Treeview from '../js/Treeview';

const data = [
  {
    id: '1',
    path: '/',
    name: 'Dashboard',
    icon: 'fas fa-user',
  },
  {
    id: '2',
    name: 'Users',
    icon: 'fas fa-user',
    children: [
      {
        id: '2-1',
        path: '/me',
        name: 'Me',
        icon: 'fas fa-user',
      },
      {
        id: '2-2',
        path: '/users',
        name: 'Users List',
        icon: 'fas fa-user',
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
    const { nodes } = this.state;
    const nodesRendered = nodes.map((node, index) => (
      <SidebarMenuNode
        key={node.id || index}
        node={node}
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

export default SidebarMenu;
