import React, { ReactNode } from 'react';

import ToolBar, { ToolBarElementData } from '../ToolBar';
import TabbedPanel, { TabbedPanelElement, TabbedPanelProps } from '../../ui/components/TabbedPanel';
import NewWindow from 'react-new-window';
import { UiComponentLocation, useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';
import classNames from 'classnames';
import FloatingWindowContainer from '../FloatingWindowContainer';
import OverlayWindowContainer from '../OverlayWindowContainer';
import LayoutCard from '../../ui/components/LayoutCard';

export interface ViewerLayoutProps {
  toolBarElements: ToolBarElementData[];
  leftPanels: TabbedPanelElement[];
  rightPanels: TabbedPanelElement[];
  children?: ReactNode;
}

const ViewerLayout: React.FC<ViewerLayoutProps> = ({ toolBarElements, leftPanels, rightPanels, children }) => {
  const [{ componentLocations }, { updateComponentLocations }] = useViewerLayoutContext();

  function setLocationForAll(location: UiComponentLocation) {
    updateComponentLocations({
      toolBarLocation: location,
      leftPanelLocation: location,
      rightPanelLocation: location
    });
  }

  function renderLeftPanel() {
    const panelProps: TabbedPanelProps = {
      elements: leftPanels!,
      side: 'left'
    };
    if (!isComponentPopOut(componentLocations.leftPanelLocation!)) {
      panelProps.onPopClick = () =>
        updateComponentLocations({ leftPanelLocation: UiComponentLocation.SEPARATE_WINDOW });
    }
    return <TabbedPanel {...panelProps} />;
  }

  function renderRightPanel() {
    const panelProps: TabbedPanelProps = {
      elements: rightPanels!,
      side: 'right'
    };
    if (!isComponentPopOut(componentLocations.rightPanelLocation!)) {
      panelProps.onPopClick = () =>
        updateComponentLocations({ rightPanelLocation: UiComponentLocation.SEPARATE_WINDOW });
    }
    return <TabbedPanel {...panelProps} />;
  }

  function isComponentPopOut(location: UiComponentLocation) {
    return location === UiComponentLocation.SEPARATE_WINDOW;
  }

  function renderPopOutPanels() {
    const renderWindow = componentLocations.leftPanelLocation || componentLocations.rightPanelLocation;
    if (renderWindow) {
      return (
        // @ts-ignore
        <NewWindow
          title={'Annotator panels'}
          onUnload={() => setLocationForAll(UiComponentLocation.MAIN_VIEW)}
          features={{ height: 1200, width: 1000 }}
        >
          <div className={'flex flex-col w-full h-full p-4 gap-y-4 bg-dark-bg'}>
            {isComponentPopOut(componentLocations.toolBarLocation!) && (
              <div className={'h-22 w-full'}>
                <ToolBar elements={toolBarElements} />
              </div>
            )}
            <div className={'w-full h-full flex flex-row gap-x-4'}>
              <div className={'w-1/2'}>
                {isComponentPopOut(componentLocations.leftPanelLocation!) && renderLeftPanel()}
              </div>
              <div className={'w-1/2'}>
                {isComponentPopOut(componentLocations.rightPanelLocation!) && renderRightPanel()}
              </div>
            </div>
          </div>
        </NewWindow>
      );
    }
  }

  return (
    <div className={classNames('w-full h-full flex flex-row bg-dark-bg p-4 text-sm')}>
      <FloatingWindowContainer />
      <OverlayWindowContainer />
      {renderPopOutPanels()}
      {!isComponentPopOut(componentLocations.leftPanelLocation!) && leftPanels.length > 0 && (
        <div className={'w-2/12 pr-4'}>{renderLeftPanel()}</div>
      )}
      <div className={'flex-grow'}>
        <div className={'flex flex-col w-full h-full'}>
          {!isComponentPopOut(componentLocations.toolBarLocation!) && (
            <div className={'h-22 pb-4 w-full'}>
              <ToolBar
                elements={toolBarElements}
                onPopClick={() => setLocationForAll(UiComponentLocation.SEPARATE_WINDOW)}
              />
            </div>
          )}
          <LayoutCard className={classNames('flex-grow h-auto')}>{children}</LayoutCard>
        </div>
      </div>
      {!isComponentPopOut(componentLocations.rightPanelLocation!) && rightPanels.length > 0 && (
        <div className={'w-2/12 pl-4'}>{renderRightPanel()}</div>
      )}
    </div>
  );
};

export default ViewerLayout;
