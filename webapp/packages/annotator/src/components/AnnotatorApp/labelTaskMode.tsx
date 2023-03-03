import { TabbedPanelElement } from '@labelstack/viewer/src/ui/components/TabbedPanel';
import { BsBriefcase, BsFilePerson, BsListTask } from 'react-icons/bs';
import { AnnotatorImageList } from '@labelstack/annotator/src/ui/panel_sections/AnnotatorImageList';
import UserInfo from '@labelstack/viewer/src/ui/panel_sections/UserInfo';
import React from 'react';
import { ToolBarElementData } from '@labelstack/viewer/src/components/ToolBar';
import ViewModeSelector from '@labelstack/viewer/src/ui/panel_sections/ViewModeSelector';
import ImagePropertiesOptions from '@labelstack/viewer/src/ui/panel_sections/ImagePropertiesOptions';
import AssignLabelsPanel from '../../ui/panel_sections/AssignLabelsPanel';
import TaskStatusControl from '../../ui/panel_sections/TaskStatusControl';
import ImageMetadata from '@labelstack/viewer/src/ui/panel_sections/ImageMetadata';
import UiMode from '@labelstack/viewer/src/components/ViewerLayout/uiMode';

const toolBarElements: ToolBarElementData[] = [
  { element: <ViewModeSelector /> },
  { element: <ImagePropertiesOptions /> }
];

const leftPanels: TabbedPanelElement[] = [
  {
    icon: BsListTask,
    name: 'Task Details',
    sections: [
      {
        name: 'Task Status',
        element: <TaskStatusControl />
      },
      {
        name: 'Image Metadata',
        element: <ImageMetadata />
      },
      {
        name: 'Task Images',
        element: <AnnotatorImageList />
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
    name: 'Label Task Panel',
    sections: [
      {
        name: 'Image Labels',
        element: <AssignLabelsPanel />
      }
    ]
  }
];

const uiModeLabelTask: UiMode = {
  toolBarElements,
  leftPanels,
  rightPanels
};

export default uiModeLabelTask;
