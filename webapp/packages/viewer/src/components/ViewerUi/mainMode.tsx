import { TabbedPanelElement } from '@labelstack/viewer/src/ui/components/TabbedPanel';
import { BsBriefcase, BsFilePerson, BsListTask } from 'react-icons/bs';

import UserInfo from '@labelstack/viewer/src/ui/panel_sections/UserInfo';
import React from 'react';
import { ToolBarElementData } from '@labelstack/viewer/src/ui/components/ToolBar';
import ViewModeSelector from '@labelstack/viewer/src/ui/panel_sections/ViewModeSelector';
import ViewerImageList from '../../ui/panel_sections/ImageList/ViewerImageList';
import { ViewerLabelMapList } from '../../ui/panel_sections/LabelMapList/ViewerLabelMapList';
import ImageMetadata from '../../ui/panel_sections/ImageMetadata';
import ImagePropertiesOptions from '../../ui/panel_sections/ImagePropertiesOptions';
import UiMode from './uiMode';

const toolBarElements: ToolBarElementData[] = [
  { element: <ViewModeSelector /> },
  { element: <ImagePropertiesOptions /> }
];

const leftPanels: TabbedPanelElement[] = [
  {
    icon: BsListTask,
    name: 'Viewer Panel',
    sections: [
      {
        name: 'Image Metadata',
        element: <ImageMetadata />
      },
      {
        name: 'Image List',
        element: <ViewerImageList />
      }
    ]
  },
  {
    icon: BsFilePerson,
    name: 'User Info',
    sections: [
      {
        name: 'User Info',
        element: <UserInfo />
      }
    ]
  }
];

const rightPanels: TabbedPanelElement[] = [
  {
    icon: BsBriefcase,
    name: 'Viewer Panel',
    sections: [
      {
        name: 'Completed Annotations',
        element: <ViewerLabelMapList />
      }
    ]
  }
];

const uiModeMain: UiMode = {
  toolBarElements,
  leftPanels,
  rightPanels
};

export default uiModeMain;
