import React, { useState } from 'react';
import { IconType } from 'react-icons';
import PanelButton from '../PanelButton';
import classNames from 'classnames';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import PanelCollapsible from '../PanelCollapsible';
import LayoutCard from '../../../components/LayoutCard';
import TopBarButton from '../TopBarButton';

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

const TabbedPanel: React.FC<TabbedPanelProps> = ({ elements, side, onPopClick }) => {
  const [activePanel, setActivePanel] = useState<TabbedPanelElement | undefined>(elements.at(0));

  return (
    <div className={'flex flex-col h-full w-full'}>
      <div className="h-22 pb-4">
        <LayoutCard className={classNames('flex px-4 gap-x-2', side === 'right' ? 'flex-row-reverse' : 'flex-row')}>
          {onPopClick && (
            <>
              <TopBarButton
                name={'Pop out'}
                icon={BsBoxArrowUpRight}
                containerClassName="place-self-center"
                isActive={false}
                onClick={() => onPopClick()}
              />
              <div className={'w-0'} />
            </>
          )}
          {elements.map((panelData) => (
            <TopBarButton
              key={panelData.name}
              name={panelData.name}
              icon={panelData.icon}
              containerClassName="place-self-center"
              isActive={activePanel.name === panelData.name}
              onClick={() => setActivePanel(panelData)}
            />
          ))}
        </LayoutCard>
      </div>
      <div className={classNames('flex flex-grow flex-col space-y-4 w-full overflow-y-scroll no-scrollbar rounded-lg')}>
        {activePanel &&
          activePanel.sections.map((section) => (
            <div key={section.name} className={'max-h-2/3'}>
              <PanelCollapsible headerName={section.name}>{section.element}</PanelCollapsible>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TabbedPanel;
