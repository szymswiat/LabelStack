declare module '@kitware/vtk.js/Filters/General/PaintFilter' {
  import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
  import { vtkAlgorithm } from '@kitware/vtk.js/interfaces';
  import { vtkPipelineConnection } from '@kitware/vtk.js/types';
  import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
  import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
  import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper';

  class vtkPaintFilter implements vtkAlgorithm {
    static newInstance: (options?: any) => vtkPaintFilter;

    setBackgroundImage: (imageData: vtkImageData) => void;
    setLabel: (label: number) => void;
    setSlicingMode: (mode: SlicingMode) => void;
    getLabel: () => number;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    startStroke: () => void;
    endStroke: () => Promise<any>;
    addPoint: (point: any) => void;
    paintPolygon: (points: any) => void;
    setRadius: (radius: number) => void;
    delete: () => void;

    addInputConnection(outputPort: vtkPipelineConnection): void;

    addInputData(dataset: any): void;

    setInputData(dataset: any, port?: number): void;

    getInputArrayToProcess(inputPort?: number): vtkDataArray;

    getInputConnection(port?: number): vtkPipelineConnection;

    getInputData(port?: number): any;

    getNumberOfInputPorts(): number;

    getNumberOfOutputPorts(): number;

    getOutputData(port?: number): vtkImageData | vtkPolyData;

    getOutputPort(port?: number): vtkPipelineConnection;

    setInputArrayToProcess(
      inputPort: number,
      arrayName: string,
      fieldAssociation: string,
      attributeType?: string
    ): void;

    setInputConnection(outputPort: vtkPipelineConnection, port?: number): void;

    setLabelMap(labelMap: vtkImageData): void;

    applyLabelMap(labelMap: vtkImageData): void;

    shouldUpdate(): boolean;

    update(): void;
  }

  export = vtkPaintFilter;
}

declare module '@kitware/vtk.js/Widgets/Core/WidgetManager' {
  import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';

  class vtkWidgetManager {
    static newInstance: (options?: any) => vtkWidgetManager;

    setRenderer: (renderer: vtkRenderer) => void;
    addWidget: (widget: any, viewType: number) => any;
    removeWidget: (widget: any) => void;
    removeWidgets: () => void;
    grabFocus: (widget: any) => void;
    releaseFocus: () => void;
    enablePicking: () => void;
    disablePicking: () => void;
    delete: () => void;
  }

  export = vtkWidgetManager;
}

declare module '@kitware/vtk.js/Widgets/Widgets3D/PaintWidget' {
  class vtkPaintWidget {
    static newInstance: (options?: any) => vtkPaintWidget;
    static extend: (publicAPI: any, model: any, initialValues?: any) => void;

    getWidgetState: () => any;
    setRadius: (radius: number) => void;
    getRadius: () => number;
    getManipulator: () => any;
  }

  export = vtkPaintWidget;
}

declare module '@kitware/vtk.js/Widgets/Widgets3D/SplineWidget' {
  class vtkSplineWidget {
    static newInstance: (options?: any) => vtkSplineWidget;
    static extend: (publicAPI: any, model: any, initialValues?: any) => void;

    setDragable: (draggable: boolean) => void;
    getManipulator: () => any;
  }

  export = vtkSplineWidget;
}

declare module '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants.js' {
  enum ViewTypes {
    DEFAULT = 0,
    GEOMETRY = 1,
    SLICE = 2,
    VOLUME = 3,
    YZ_PLANE = 4, // Sagittal
    XZ_PLANE = 5 // Coronal
  }

  export { ViewTypes };
}

declare module '@kitware/vtk.js/Interaction/Manipulators/MouseRangeManipulator' {
  class vtkMouseRangeManipulator {
    static newInstance: (options?: any) => vtkMouseRangeManipulator;

    setVerticalListener: (
      min: number,
      max: number,
      step: number,
      getValue: () => number,
      setValue: (value: number) => void,
      scale: number
    ) => void;

    setHorizontalListener: (
      min: number,
      max: number,
      step: number,
      getValue: () => number,
      setValue: (value: number) => void,
      scale: number
    ) => void;

    setScrollListener: (
      min: number,
      max: number,
      step: number,
      getValue: () => number,
      setValue: (value: number) => void,
      scale: number
    ) => void;
  }

  export = vtkMouseRangeManipulator;
}

declare module '@kitware/vtk.js/Imaging/Core/ImageReslice' {
  import { vtkPipelineConnection } from '@kitware/vtk.js/types';
  import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';

  class vtkImageReslice {
    static newInstance: (options?: any) => vtkImageReslice;
    static extend: (publicAPI: any, model: any, initialValues?: any) => void;

    getOutputPort(port?: number): vtkPipelineConnection;

    setInputData(data: vtkImageData): void;

    setScalarShift(value: number): void;

    setScalarScale(value: number): void;
  }

  export = vtkImageReslice;
}

declare module '@kitware/vtk.js/Filters/Sources/RTAnalyticSource';
