import React from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';

import ContentHeader from '../Components/ContentHeader';
import SmallBoxes from '../Components/SmallBoxes';
import Chart from '../Components/Chart';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { self } = this.props;
    return (
      <div style={{ minHeight: '511px' }}>
        <ContentHeader header="Dashboard" />
        <div className="container-fluid">
          <SmallBoxes self={self} />
          <div className="row">
            <Chart self={self} />
            <div className="col-lg-5">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
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

export default Dashboard;
