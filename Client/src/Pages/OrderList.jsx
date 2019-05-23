import React from 'react';
import PropTypes from 'prop-types';
import {
  Route, Switch, Link, Redirect,
} from 'react-router-dom';
import _ from 'lodash';

import ContentHeader from '../Components/ContentHeader';
import InferiorOrderTable from '../Components/InferiorOrderTable';
import SuperiorOrderTable from '../Components/SuperiorOrderTable';
import OrderTable from '../Components/OrderTable';

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    const { header } = this.props;
    this.state = {
      header,
    };
  }

  render() {
    const { header } = this.state;
    const { self } = this.props;
    return (
      <div style={{ minHeight: '511px' }}>
        <ContentHeader header={header} />
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header p-2">
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${window.location.pathname === '/orders/inferior' ? 'active ' : ''}`}
                      to="/orders/inferior"
                      onClick={() => this.setState(() => ({ header: 'Inferior Orders List' }))}
                    >
                      {'Inferior Orders'}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${window.location.pathname === '/orders/superior' ? 'active ' : ''}`}
                      to="/orders/superior"
                      onClick={() => this.setState(() => ({ header: 'Superior Orders List' }))}
                    >
                      {'Superior Orders'}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <Switch>
                  <Route
                    exact
                    path="/orders/inferior"
                    render={props => (
                      <InferiorOrderTable
                        {...props}
                        self={self}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/orders/superior"
                    render={props => (
                      <SuperiorOrderTable
                        {...props}
                        self={self}
                      />
                    )}
                  />
                  <Route
                    path="/orders"
                    render={(props) => {
                      if (_.find(self.roles, { name: 'Admin' })) {
                        return (
                          <OrderTable
                            {...props}
                            self={self}
                          />
                        );
                      }
                      return <Redirect to="/orders/inferior" />;
                    }}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </section>

      </div>
    );
  }
}

OrderList.propTypes = {
  self: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
  header: PropTypes.string.isRequired,
};
export default OrderList;
