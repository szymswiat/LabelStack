import React from 'react';
import classNames from 'classnames';
import { BsAsterisk } from 'react-icons/bs';

interface ContentChangedIndicatorProps {
  className?: string;
}

const ContentChangedIndicator: React.FC<ContentChangedIndicatorProps> = ({ className }) => {
  return (
    <div className={classNames(className, 'place-self-center grid place-items-center')}>
      <BsAsterisk className="w-full h-full text-red-700" />
    </div>
  );
};

export default ContentChangedIndicator;
