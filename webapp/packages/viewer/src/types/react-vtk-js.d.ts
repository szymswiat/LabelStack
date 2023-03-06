declare module 'react-vtk-js' {
  import React, { Context } from 'react';
  import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
  import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
  import vtkCamera from '@kitware/vtk.js/Rendering/Core/Camera';
  import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
  import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
  import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator.js';
  import vtkOpenGLHardwareSelector from '@kitware/vtk.js/Rendering/OpenGL/HardwareSelector.js';

  export interface ViewProps {
    id?: string;
    style?: {
      width?: string;
      height?: string;
    };
    className?: string;
    background?: number[];
    interactorSettings?: object[];
    interactive?: boolean;

    cameraPosition?: number[];
    cameraViewUp?: number[];
    cameraParallelProjection?: boolean;
    triggerRender?: number;
    triggerResetCamera?: number;
    children?: React.ReactElement | React.ReactElement[];
    pickingModes?: string[];
    onClick?: () => void;
    clickInfo?: object;
    onMouseDown?: () => void;
    mouseDownInfo?: object;
    onMouseUp?: () => void;
    mouseUpInfo?: object;
    onHover?: () => void;
    hoverInfo?: object;
    onSelect?: () => void;
    selectInfo?: object;
    pointerSize?: number;
    showCubeAxes?: boolean;
    cubeAxesStyle?: object;
  }

  export class View extends React.Component<ViewProps, any> {
    renderWindow: vtkRenderWindow;
    renderer: vtkRenderer;
    camera: vtkCamera;
    openglRenderWindow: vtkOpenGLRenderWindow;
    interactor: vtkRenderWindowInteractor;
    style: vtkInteractorStyleManipulator;
    selector: vtkOpenGLHardwareSelector;
    resizeObserver: ResizeObserver;

    renderView(): void;

    resetCamera(): void;

    updateCubeBounds(): void;
  }

  namespace Contexts {
    const ViewContext: Context<View>;
    const RepresentationContext: Context<any>;
    const DataSetContext: Context<any>;
    const FieldsContext: Context<any>;
    const DownstreamContext: Context<any>;
  }

  export { Contexts };
}
