import React, { ReactNode, useEffect, useState } from 'react';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { DraggableData, DraggableEvent } from 'react-draggable';
import CloseableWindow from '../CloseableWindow';
import { useLocalStorage } from '@labelstack/app/src/utils/hooks';

interface WindowCacheProps {
  x: number;
  y: number;
  height: number;
  width: number;
}

interface FloatingWindowProps {
  name: string;
  onClose: () => void;
  children?: ReactNode;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({ name, onClose, children }) => {
  const cacheKey = `${name.replace(' ', '')}WindowProps`;

  const [windowProps, setWindowProps] = useLocalStorage<WindowCacheProps>(cacheKey, getDefaultWindowProps());

  function getDefaultWindowProps(): WindowCacheProps {
    let { innerWidth: screenW, innerHeight: screenH } = window;
    let [width, height] = [screenW / 4, screenH / 4];

    return { width, height, x: screenW / 2 - width / 2, y: screenH / 2 - height / 2 };
  }

  function onWindowDragStop(e: DraggableEvent, data: DraggableData) {
    windowProps.x = data.lastX;
    windowProps.y = data.lastY;

    setWindowProps({ ...windowProps });
  }

  const onWindowResizeStop: RndResizeCallback = (e, dir, elementRef, delta, position) => {
    windowProps.width = elementRef.clientWidth;
    windowProps.height = elementRef.clientHeight;

    setWindowProps({ ...windowProps });
  };

  if (!windowProps) {
    return <></>;
  }

  function renderHeader() {
    return <div className={'flex-grow place-self-center font-bold'}>{name}</div>;
  }

  return (
    <Rnd bounds={'window'} default={windowProps} onDragStop={onWindowDragStop} onResizeStop={onWindowResizeStop}>
      <CloseableWindow className={'w-full h-full cursor-default'} headerComponent={renderHeader()} onClose={onClose}>
        {children}
      </CloseableWindow>
    </Rnd>
  );
};

export default FloatingWindow;
