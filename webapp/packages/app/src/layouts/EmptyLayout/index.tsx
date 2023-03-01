import LayoutCard from '@labelstack/viewer/src/components/LayoutCard';
import React from 'react';

export interface EmptyLayoutProps {
  children?: React.ReactNode;
}

const EmptyLayout: React.FC<EmptyLayoutProps> = ({ children }) => {
  return <LayoutCard className="w-full h-full p-4">{children}</LayoutCard>;
};

export default EmptyLayout;
