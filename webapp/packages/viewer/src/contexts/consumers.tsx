import React, { useContext } from 'react';
import { Contexts, View } from 'react-vtk-js';

export interface ViewContextConsumer {
  view: View;

  onViewContextUpdate?: () => void;
}

export function assignViewContext(consumer: ViewContextConsumer) {
  return (
    <Contexts.ViewContext.Consumer>
      {(data: View) => {
        consumer.view = data;
        if (consumer.onViewContextUpdate) {
          new Promise(() => consumer.onViewContextUpdate?.());
        }
        return <></>;
      }}
    </Contexts.ViewContext.Consumer>
  );
}

export function consumeViewContext(consumer: (view: View) => JSX.Element) {
  return <Contexts.ViewContext.Consumer>{(data) => consumer(data)}</Contexts.ViewContext.Consumer>;
}

export const useViewContext = () => useContext(Contexts.ViewContext);
