import React from 'react';
import PropTypes from 'prop-types';

const ContentHeader = ({ header }) => (
  <section className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1>{header}</h1>
        </div>
        <div className="col-sm-6" />
      </div>
    </div>
  </section>
);

ContentHeader.propTypes = {
  header: PropTypes.string.isRequired,
};
export default ContentHeader;
