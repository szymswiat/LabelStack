import React from 'react';
import classNames from 'classnames';
import PanelButton from '../PanelButton';
import { BsBoxArrowUpRight, BsGear } from 'react-icons/bs';
import ViewerSettings from '../../../components/ViewerSettings';
import { useViewerLayoutContext } from '../../../contexts/ViewerLayoutContext';
import Divider from '../Divider';

export interface ToolBarElementData {
  element: React.ReactElement;
}

interface ToolBarProps {
  onPopClick?: () => void;
  elements: ToolBarElementData[];
}

const panelButtonStyles = {
  className: classNames('place-self-center p-2 w-16 h-16'),
  size: 30
};

const ToolBar: React.FC<ToolBarProps> = ({ onPopClick, elements }) => {
  const [, { showOverlayWindow, hideOverlayWindow }] = useViewerLayoutContext();

  function showSettingsWindow() {
    showOverlayWindow(<ViewerSettings onClose={hideOverlayWindow} />);
  }

  return (
    <div className={classNames('flex h-24 pr-4 pl-4 flex-row-reverse')}>
      {onPopClick && (
        <PanelButton
          name={'Pop out all'}
          icon={BsBoxArrowUpRight}
          iconProps={{ size: panelButtonStyles.size }}
          containerClassName={panelButtonStyles.className}
          isActive={false}
          onClick={() => onPopClick()}
        />
      )}
      <PanelButton
        name={'Settings'}
        icon={BsGear}
        iconProps={{ size: panelButtonStyles.size }}
        isActive={false}
        containerClassName={panelButtonStyles.className}
        onClick={showSettingsWindow}
      />
      <div className={'flex-grow flex flex-row place-self-center'}>
        {elements.map((element, index) => (
          <React.Fragment key={index}>
            {element.element}
            {index < elements.length - 1 && (
              <div className={'w-10'}>
                <Divider orientation={'vertical'} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ToolBar;
