import React, { ReactNode } from 'react';
import ViewerLayout from '../../ui/layouts/ViewerLayout';
import uiModeMain from './mainMode';

export interface ViewerUiProps {
  children?: ReactNode;
}

const ViewerUi: React.FC<ViewerUiProps> = ({ children }) => {
  return <ViewerLayout {...uiModeMain}>{children}</ViewerLayout>;
};

export default ViewerUi;
