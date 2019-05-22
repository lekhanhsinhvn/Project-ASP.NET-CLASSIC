import React from 'react';

import ContentHeader from '../Components/ContentHeader';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div style={{ minHeight: '511px' }}>
        <ContentHeader header="Dashboard" />
      </div>
    );
  }
}

export default Dashboard;
