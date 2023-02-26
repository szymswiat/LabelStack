import LayoutCard from '@labelstack/viewer/src/components/LayoutCard';
import React from 'react';

export interface RightBarLayoutProps {
  children?: React.ReactNode;
  rightBarComponent: React.ReactNode;
}

const RightBarLayout: React.FC<RightBarLayoutProps> = ({ children, rightBarComponent }) => {
  return (
    <div className="flex flex-row h-full w-full gap-x-4">
      <div className="basis-3/4 py-1">{children}</div>
      <LayoutCard className="h-full basis-1/4 p-4">
        <div className="h-full overflow-y-scroll no-scrollbar">{rightBarComponent}</div>
      </LayoutCard>
    </div>
  );
};

export default RightBarLayout;
