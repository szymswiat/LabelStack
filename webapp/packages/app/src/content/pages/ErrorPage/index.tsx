import React from 'react';
import { useLocation } from 'react-router';

export interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC = () => {
  const { message } = useLocation().state as ErrorPageProps;

  return (
    <div className={'w-full h-full bg-primary-dark text-primary-light grid'}>
      <div className={'flex flex-col place-self-center gap-y-20'}>
        <div className={'text-6xl place-self-center font-bold'}>Error</div>
        <div className={'text-2xl place-self-center'}>{message}</div>
      </div>
    </div>
  );
};

export default ErrorPage;
