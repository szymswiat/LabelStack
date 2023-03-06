import React, { ReactNode } from 'react';
import useCollapse from 'react-collapsed';
import { UseCollapseInput } from 'react-collapsed/dist/types';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface PanelCollapsibleProps {
  headerName: string;
  children?: ReactNode;
}

const PanelCollapsible: React.FC<PanelCollapsibleProps> = ({ headerName, children }) => {
  const collapseInput: UseCollapseInput = {
    defaultExpanded: true
  };
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse(collapseInput);

  return (
    <div className={'w-full text-primary-light pl-4 pr-4 select-none'}>
      <div className={'bg-secondary-dark rounded-lg h-fit'}>
        <div className={'w-full h-16 flex flex-row'} {...getToggleProps()}>
          <div className={'pl-6 flex-none font-bold grid'}>
            <div className={'place-self-center'}>{headerName}</div>
          </div>
          <div className={'flex-grow'} />
          <div className={'flex-none place-self-center pr-6'}>
            {isExpanded ? <IoIosArrowUp size={25} /> : <IoIosArrowDown size={25} />}
          </div>
        </div>
        <div className={'w-full pl-6 pr-6'} {...getCollapseProps()}>
          <div className={'w-full pb-4 mt-4'}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PanelCollapsible;
