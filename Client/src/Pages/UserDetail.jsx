import React from 'react';
import PropTypes from 'prop-types';

import ContentHeader from '../Components/ContentHeader';
import UserForm from '../Components/UserForm';

const UserDetail = ({
  user, dataUser, header, getUser, edit,
}) => (
  <div style={{ minHeight: '511px' }}>
    <ContentHeader header={header} />
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <div className="card card-primary card-outline">
              <div className="card-body box-profile">
                <div className="text-center">
                  <img className="profile-user-img img-fluid img-circle" src={`/images/${dataUser && dataUser.avatar}`} alt="User profile" />
                </div>
                <h3 className="profile-username text-center">{dataUser && dataUser.name}</h3>
                <ul className="list-group list-group-unbordered mb-3">
                  <li className="list-group-item">
                    <b>Name</b>
                    <div className="float-right">{dataUser && dataUser.name}</div>
                  </li>
                  <li className="list-group-item">
                    <b>Email</b>
                    <div className="float-right">{dataUser && dataUser.email}</div>
                  </li>
                  <li className="list-group-item">
                    <b>Created</b>
                    <div className="float-right">{dataUser && dataUser.createdDate}</div>
                  </li>
                  <li className="list-group-item">
                    <b>Modified</b>
                    <div className="float-right">{dataUser && dataUser.modifiedDate}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="card">
              <div className="card-body">
                <UserForm edit={edit} user={user} dataUser={dataUser} getUser={getUser} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

UserDetail.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    createdDate: PropTypes.string,
    modifiedDate: PropTypes.string,
  }).isRequired,
  dataUser: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    createdDate: PropTypes.string,
    modifiedDate: PropTypes.string,
  }).isRequired,
  header: PropTypes.string.isRequired,
  getUser: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default UserDetail;
