import React, { useId } from 'react';
import ReactTooltip, { Type } from 'react-tooltip';

interface TooltipProps {
  children: React.ReactNode;
  tooltipText: string;
  type?: Type;
}

const Tooltip: React.FC<TooltipProps> = ({ children, tooltipText, type }) => {
  const tooltipKey = useId();
  return (
    <>
      <ReactTooltip id={tooltipKey} type={type ? type : 'info'} className={'bg-black'} effect={'solid'} delayShow={700}>
        {tooltipText}
      </ReactTooltip>
      <div className={'w-full h-full'} data-tip data-for={tooltipKey}>
        {children}
      </div>
    </>
  );
};

export default Tooltip;
