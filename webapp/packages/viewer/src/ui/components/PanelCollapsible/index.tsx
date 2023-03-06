import React, { ReactNode } from 'react';
import useCollapse from 'react-collapsed';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import LayoutCard from '../../components/LayoutCard';

interface PanelCollapsibleProps {
  headerName: string;
  children?: ReactNode;
}

const PanelCollapsible: React.FC<PanelCollapsibleProps> = ({ headerName, children }) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({ defaultExpanded: true });

  const ExpandIcon = isExpanded ? IoIosArrowUp : IoIosArrowDown;

  return (
    <LayoutCard className={'w-full select-none h-fit'}>
      <div className={'w-full h-16 flex flex-row'} {...getToggleProps()}>
        <div className={'pl-6 flex-none font-bold grid'}>
          <div className={'place-self-center text-base'}>{headerName}</div>
        </div>
        <div className={'flex-grow'} />
        <div className={'flex-none place-self-center pr-6'}>
          <ExpandIcon className="w-7 h-7" />
        </div>
      </div>
      <div className={'flex flex-col w-full px-6 divide-y divide-dark-text'} {...getCollapseProps()}>
        <div className="h-0" />
        <div className={'w-full py-4'}>{children}</div>
      </div>
    </LayoutCard>
  );
};

export default PanelCollapsible;
