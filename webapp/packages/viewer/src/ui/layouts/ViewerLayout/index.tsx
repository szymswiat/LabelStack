import React, { ReactNode } from 'react';

import ToolBar, { ToolBarElementData } from '../../components/ToolBar';
import TabbedPanel, { TabbedPanelElement, TabbedPanelProps } from '../../components/TabbedPanel';
import NewWindow from 'react-new-window';
import { UiComponentLocation, useViewerLayoutContext } from '../../../contexts/ViewerLayoutContext';
import classNames from 'classnames';
import FloatingWindowContainer from '../../../components/FloatingWindowContainer';
import OverlayWindowContainer from '../../../components/OverlayWindowContainer';

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

  function allComponentsPopOut() {
    for (const location of Object.values(componentLocations)) {
      if (location === UiComponentLocation.MAIN_VIEW) {
        return false;
      }
    }
    return true;
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
          <div className={'flex flex-col w-full h-full bg-primary-dark'}>
            {isComponentPopOut(componentLocations.toolBarLocation!) && (
              <div className={'h-24 w-full'}>
                <ToolBar elements={toolBarElements} />
              </div>
            )}
            <div className={'w-full h-full flex flex-row'}>
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

  const allPopOut = allComponentsPopOut();
  return (
    <div className={'w-full h-full flex flex-row bg-primary-dark'}>
      <FloatingWindowContainer />
      <OverlayWindowContainer />
      {renderPopOutPanels()}
      {!isComponentPopOut(componentLocations.leftPanelLocation!) && leftPanels.length > 0 && (
        <div className={'w-2/12'}>{renderLeftPanel()}</div>
      )}
      <div className={'flex-grow'}>
        <div className={'flex flex-col w-full h-full'}>
          {!isComponentPopOut(componentLocations.toolBarLocation!) && (
            <div className={'h-24 w-full'}>
              <ToolBar
                elements={toolBarElements}
                onPopClick={() => setLocationForAll(UiComponentLocation.SEPARATE_WINDOW)}
              />
            </div>
          )}
          <div className={classNames('h-full w-full', { 'pb-4': !allPopOut, 'p-4': allPopOut })}>{children}</div>
        </div>
      </div>
      {!isComponentPopOut(componentLocations.rightPanelLocation!) && rightPanels.length > 0 && (
        <div className={'w-2/12'}>{renderRightPanel()}</div>
      )}
    </div>
  );
};

export default ViewerLayout;
