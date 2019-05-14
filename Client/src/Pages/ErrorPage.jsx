import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../Components/ContentHeader';

const ErrorPage = ({ code, message }) => (
  <div style={{ minHeight: '511px' }}>
    <ContentHeader header="Error Pages" />
    <section className="content">
      <div className="container-fluid">
        <div className="error-page">
          <h2 className="headline text-danger">{code}</h2>
        </div>
        <div className="error-content">
          <h3>
            {message}
          </h3>
        </div>
      </div>
    </section>
  </div>
);
ErrorPage.propTypes = {
  code: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
export default ErrorPage;
