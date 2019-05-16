import React from 'react';
import PropTypes from 'prop-types';

import ContentHeader from '../Components/ContentHeader';
import UserFormSelf from '../Components/UserFormSelf';
import UserForm from '../Components/UserForm';

const UserDetail = ({
  self, dataUser, header, getSelf, edit, QUERY,
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
                    <b>Email</b>
                    <div className="float-right">{dataUser && dataUser.email}</div>
                  </li>
                  <li className="list-group-item">
                    <b>Roles</b>
                    <div className="float-right">
                      {dataUser.roles.map((role, index) => (
                        <React.Fragment key={role.roleId || index}>
                          {`${role.name}, `}
                        </React.Fragment>
                      ))}
                    </div>
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
                {QUERY === 'USER' && <UserForm edit={edit} self={self} dataUser={dataUser} getSelf={getSelf} />}
                {QUERY === 'SELF' && <UserFormSelf edit={edit} self={self} dataUser={dataUser} getSelf={getSelf} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

UserDetail.propTypes = {
  self: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      roleId: PropTypes.number,
      name: PropTypes.string,
      level: PropTypes.number,
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
      roleId: PropTypes.number,
      name: PropTypes.string,
      level: PropTypes.number,
    })),
    createdDate: PropTypes.string,
    modifiedDate: PropTypes.string,
  }).isRequired,
  header: PropTypes.string.isRequired,
  getSelf: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  QUERY: PropTypes.string.isRequired,
};

export default UserDetail;
