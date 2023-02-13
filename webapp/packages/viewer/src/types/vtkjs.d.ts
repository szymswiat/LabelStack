declare module '@kitware/vtk.js/Filters/General/PaintFilter' {
  import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
  import { vtkAlgorithm } from '@kitware/vtk.js/interfaces';
  import { vtkPipelineConnection } from '@kitware/vtk.js/types';
  import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
  import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
  import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

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
