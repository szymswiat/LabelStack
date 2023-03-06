import React from 'react';
import classNames from 'classnames';

interface ContentChangedIndicatorProps {
  modified: boolean;
  className?: string;
}

const ContentChangedIndicator: React.FC<ContentChangedIndicatorProps> = ({ modified, className }) => {
  return (
    <div
      className={classNames(className, 'rounded-full place-self-center', modified ? 'bg-red-700' : 'bg-green-700')}
    />
  );
};

export default ContentChangedIndicator;
