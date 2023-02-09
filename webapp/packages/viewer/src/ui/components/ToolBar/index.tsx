import React from 'react';
import classNames from 'classnames';
import PanelButton from '../PanelButton';
import { BsBoxArrowUpRight, BsGear } from 'react-icons/bs';
import ViewerSettings from '../../../components/ViewerSettings';
import { useViewerLayoutContext } from '../../../contexts/ViewerLayoutContext';
import Divider from '../Divider';
import LayoutCard from '../../../components/LayoutCard';
import TopBarButton from '../TopBarButton';

export interface ToolBarElementData {
  element: React.ReactElement;
}

interface ToolBarProps {
  onPopClick?: () => void;
  elements: ToolBarElementData[];
}

const ToolBar: React.FC<ToolBarProps> = ({ onPopClick, elements }) => {
  const [, { showOverlayWindow, hideOverlayWindow }] = useViewerLayoutContext();

  function showSettingsWindow() {
    showOverlayWindow(<ViewerSettings onClose={hideOverlayWindow} />);
  }

  return (
    <LayoutCard className={classNames('flex px-4 gap-x-2 flex-row-reverse')}>
      {onPopClick && (
        <TopBarButton
          name={'Pop out all'}
          icon={BsBoxArrowUpRight}
          containerClassName="place-self-center"
          isActive={false}
          onClick={() => onPopClick()}
        />
      )}
      <TopBarButton
        name={'Settings'}
        icon={BsGear}
        containerClassName="place-self-center"
        isActive={false}
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
    </LayoutCard>
  );
};

export default ToolBar;
