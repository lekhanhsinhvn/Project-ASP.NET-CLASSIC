import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import UsersPage from './UsersPage';
import ProductsPage from './ProductsPage';
import CategoriesPage from './CategoriesPage';
import OrdersPage from './OrdersPage';
import Dashboard from './Dashboard';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true,
    };
    // This binding is necessary to make `this` work in the callback
    this.sidebarToggle = this.sidebarToggle.bind(this);
  }

  sidebarToggle() {
    this.setState(prevState => (
      { sidebarOpen: !prevState.sidebarOpen }
    ));
  }

  render() {
    const { self, getSelf } = this.props;
    const { sidebarOpen } = this.state;
    return (
      <div className={`sidebar-mini ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapse'}`}>
        <Navbar sidebarToggle={this.sidebarToggle} getSelf={getSelf} />
        <Sidebar sidebarToggle={this.sidebarToggle} sidebarOpen={sidebarOpen} self={self} />
        <div id="content" className="content-wrapper">
          <Switch>
            <Route
              path="/users"
              render={() => (
                <UsersPage self={self} getSelf={getSelf} />
              )}
            />
            <Route
              path="/products"
              render={() => (
                <ProductsPage self={self} getSelf={getSelf} />
              )}
            />
            <Route
              path="/categories"
              render={() => (
                <CategoriesPage self={self} getSelf={getSelf} />
              )}
            />
            <Route
              path="/orders"
              render={() => (
                <OrdersPage self={self} getSelf={getSelf} />
              )}
            />
            <Route
              path="/"
              render={() => (
                <Dashboard self={self} getSelf={getSelf} />
              )}
            />
          </Switch>
        </div>
        <footer className="main-footer">
          <strong>
            {'Le Khanh Sinh'}
          </strong>
          <div className="float-right d-none d-sm-inline-block">
            <b>Version</b>
            {' 0.0.0'}
          </div>
        </footer>
      </div>
    );
  }
}

Main.propTypes = {
  self: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
  getSelf: PropTypes.func.isRequired,
};
export default Main;
