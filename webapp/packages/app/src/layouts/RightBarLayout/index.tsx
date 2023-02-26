import LayoutCard from '@labelstack/viewer/src/components/LayoutCard';
import React from 'react';

export interface RightBarLayoutProps {
  children?: React.ReactNode;
  rightBarComponent: React.ReactNode;
}

const RightBarLayout: React.FC<RightBarLayoutProps> = ({ children, rightBarComponent }) => {
  return (
    <div className="flex flex-row h-full w-full overflow-auto gap-x-4">
      <div className="basis-3/4 py-1">{children}</div>
      <LayoutCard className="h-full basis-1/4 overflow-auto px-4">{rightBarComponent}</LayoutCard>
    </div>
  );
};

export default RightBarLayout;
