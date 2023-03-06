import React from 'react';
import CloseableWindow from '../../ui/components/CloseableWindow';

interface ViewerSettingsProps {
  onClose?: () => void;
}

const ViewerSettings: React.FC<ViewerSettingsProps> = ({ onClose }) => {
  return <CloseableWindow className={'w-3/5 h-2/3 place-self-center'} onClose={onClose}></CloseableWindow>;
};

export default ViewerSettings;
