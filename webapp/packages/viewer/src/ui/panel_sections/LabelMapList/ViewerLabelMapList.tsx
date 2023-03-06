import React from 'react';
import LabelMapList from '@labelstack/viewer/src/ui/panel_sections/LabelMapList';
import { useAnnotationDataContext } from '../../../contexts/AnnotationDataContext';

const ViewerLabelMapList: React.FC = () => {
  const [{ labelMaps }] = useAnnotationDataContext();

  return <LabelMapList editable={false} labelMaps={labelMaps} />;
};

export { ViewerLabelMapList };
