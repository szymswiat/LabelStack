import { TabbedPanelElement } from '@labelstack/viewer/src/ui/components/TabbedPanel';
import { BsBriefcase, BsFilePerson, BsListTask } from 'react-icons/bs';

import UserInfo from '@labelstack/viewer/src/ui/panel_sections/UserInfo';
import React from 'react';
import { ToolBarElementData } from '@labelstack/viewer/src/ui/components/ToolBar';
import ViewModeSelector from '@labelstack/viewer/src/ui/panel_sections/ViewModeSelector';
import ViewerImageList from '../../ui/panel_sections/ImageList/ViewerImageList';
import { ViewerLabelMapList } from '../../ui/panel_sections/LabelMapList/ViewerLabelMapList';
import ImageInfo from '../../ui/panel_sections/ImageInfo';
import ImagePropertiesOptions from '../../ui/panel_sections/ImagePropertiesOptions';

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
        name: 'Image Info',
        element: <ImageInfo />
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

export default {
  toolBarElements,
  leftPanels,
  rightPanels
};
