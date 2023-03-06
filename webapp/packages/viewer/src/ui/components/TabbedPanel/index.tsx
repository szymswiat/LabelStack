import React, { useState } from 'react';
import { IconType } from 'react-icons';
import PanelButton from '../PanelButton';
import classNames from 'classnames';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import PanelCollapsible from '../PanelCollapsible';

export interface TabbedPanelSection {
  name: string;
  element: React.ReactElement;
}

export interface TabbedPanelElement {
  icon?: IconType;
  name: string;
  sections: TabbedPanelSection[];
}

export interface TabbedPanelProps {
  elements: TabbedPanelElement[];
  side: 'left' | 'right';
  onPopClick?: () => void;
}

const panelButtonStyles = {
  className: classNames('place-self-center p-2 w-16 h-16'),
  size: 30
};

const TabbedPanel: React.FC<TabbedPanelProps> = ({ elements, side, onPopClick }) => {
  const [activePanel, setActivePanel] = useState<TabbedPanelElement | undefined>(elements.at(0));

  return (
    <div className={'flex flex-col h-full w-full'}>
      <div className={classNames(['flex h-24 pr-4 pl-4', side === 'right' ? 'flex-row-reverse' : 'flex-row'])}>
        {onPopClick && (
          <>
            <div className={panelButtonStyles.className}>
              <PanelButton
                name={'Pop out'}
                icon={BsBoxArrowUpRight}
                iconProps={{ size: panelButtonStyles.size }}
                isActive={false}
                onClick={() => onPopClick()}
              />
            </div>
            <div className={'w-5'} />
          </>
        )}
        {elements.map((panelData) => (
          <div key={panelData.name} className={panelButtonStyles.className}>
            <PanelButton
              name={panelData.name}
              icon={panelData.icon}
              iconProps={{ size: panelButtonStyles.size }}
              isActive={activePanel.name === panelData.name}
              onClick={() => setActivePanel(panelData)}
            />
          </div>
        ))}
      </div>
      <div className={'flex flex-grow flex-col space-y-4 w-full'}>
        {activePanel &&
          activePanel.sections.map((section) => (
            <div key={section.name} className={'max-h-1/2'}>
              <PanelCollapsible headerName={section.name}>{section.element}</PanelCollapsible>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TabbedPanel;
