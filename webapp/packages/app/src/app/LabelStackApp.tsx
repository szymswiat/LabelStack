import React from 'react';
import { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import 'react-notifications-component/dist/theme.css';
import 'react-circular-progressbar/dist/styles.css';
import { ReactNotifications } from 'react-notifications-component';

import routes from '../routes';
import UserDataLoader from '../components/UserDataLoader';
import { useDocumentTitle } from '../utils/hooks';


const LabelStackApp = () => {
  const content = useRoutes(routes);

  useDocumentTitle('LabelStack');

  const [userDataUpdated, setUserDataUpdated] = useState<boolean>(false);

  return (
    <>
      <ReactNotifications />
      {userDataUpdated ? content : <UserDataLoader setUserDataUpdated={setUserDataUpdated} />}
    </>
  );
};

export default LabelStackApp;
