import { TabbedPanelElement } from '@labelstack/viewer/src/ui/components/TabbedPanel';
import { BsBriefcase, BsFilePerson, BsListTask } from 'react-icons/bs';
import { AnnotatorImageList } from '@labelstack/annotator/src/ui/panel_sections/AnnotatorImageList';
import UserInfo from '@labelstack/viewer/src/ui/panel_sections/UserInfo';
import React from 'react';
import { ToolBarElementData } from '@labelstack/viewer/src/ui/components/ToolBar';
import ViewModeSelector from '@labelstack/viewer/src/ui/panel_sections/ViewModeSelector';
import ImagePropertiesOptions from '@labelstack/viewer/src/ui/panel_sections/ImagePropertiesOptions';
import { PaintToolOptions } from '../../ui/panel_sections/PaintToolOptions';
import TaskStatusControl from '../../ui/panel_sections/TaskStatusControl';
import ReviewPanel from '../../ui/panel_sections/ReviewPanel';
import { AnnotationReviewTaskLabelMapList } from '../../ui/panel_sections/AnnotatorLabelMapList';
import { LabelMapsDisplayMode } from '../../ui/panel_sections/AnnotatorLabelMapList/AnnotationReviewTaskLabelMapList';
import ImageMetadata from '@labelstack/viewer/src/ui/panel_sections/ImageMetadata';
import UiMode from '@labelstack/viewer/src/components/ViewerUi/uiMode';

const toolBarElements: ToolBarElementData[] = [
  { element: <ViewModeSelector /> },
  { element: <ImagePropertiesOptions /> },
  { element: <PaintToolOptions layoutOrientation={'horizontal'} /> }
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
    name: 'Annotation Review Task Panel',
    sections: [
      {
        name: 'Review Options',
        element: <ReviewPanel />
      },
      {
        name: 'Annotations To Correct',
        element: <AnnotationReviewTaskLabelMapList labelMapsDisplayMode={LabelMapsDisplayMode.toCorrect} />
      },
      {
        name: 'Annotations To Review',
        element: <AnnotationReviewTaskLabelMapList labelMapsDisplayMode={LabelMapsDisplayMode.toReview} />
      },
      {
        name: 'Readonly Annotations',
        element: <AnnotationReviewTaskLabelMapList labelMapsDisplayMode={LabelMapsDisplayMode.readonly} />
      }
    ]
  }
];

const uiModeAnnotationReviewTask: UiMode = {
  toolBarElements,
  leftPanels,
  rightPanels
};

export default uiModeAnnotationReviewTask;
