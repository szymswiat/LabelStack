import React from 'react';

import ManageUserForm, { ManageUserFormMode } from '../../../components/Forms/Users/ManageUserForm';

const CreateUser = () => {
  return <ManageUserForm mode={ManageUserFormMode.CREATE} />;
};

export default CreateUser;
