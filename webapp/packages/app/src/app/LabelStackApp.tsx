import React from 'react';
import { useRoutes } from 'react-router-dom';
import 'react-notifications-component/dist/theme.css';
import 'react-circular-progressbar/dist/styles.css';
import { ReactNotifications } from 'react-notifications-component';

import routes from '../routes';
import UserDataLoader from '../components/UserDataLoader';
import { useDocumentTitle } from '../utils/hooks';

const LabelStackApp: React.FC = () => {
  const content = useRoutes(routes);

  useDocumentTitle('LabelStack');

  return (
    <div className="bg-dark-bg text-dark-text w-full h-full">
      <ReactNotifications />
      <UserDataLoader />
      {content}
    </div>
  );
};

export default LabelStackApp;
