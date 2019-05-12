import React from 'react';

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
    };
    // This binding is necessary to make `this` work in the callback
    this.editableToggle = this.editableToggle.bind(this);
  }

  editableToggle() {
    this.setState(prevState => (
      { editable: !prevState.editable }
    ));
  }

  render() {
    const { editable } = this.state;
    return (
      <div />
    );
  }
}

export default UserDetail;
