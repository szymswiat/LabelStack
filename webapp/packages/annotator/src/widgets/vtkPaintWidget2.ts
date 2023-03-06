import macro from '@kitware/vtk.js/macros';
import vtkPaintWidget from '@kitware/vtk.js/Widgets/Widgets3D/PaintWidget';

function widgetBehavior(parentBehavior: any) {
  return (publicAPI: any, model: any) => {
    parentBehavior(publicAPI, model);

    const parentHandleEvent = publicAPI.handleEvent;

    publicAPI.handleEvent = (callData: any) => {
      parentHandleEvent(callData);
      return macro.VOID;
    };
  };
}

function vtkPaintWidget2(publicAPI: any, model: any) {
  model.classHierarchy.push('vtkPaintWidget2');

  model.behavior = widgetBehavior(model.behavior);
}

export function extend(publicAPI: any, model: any, initialValues = {}) {
  vtkPaintWidget.extend(publicAPI, model, initialValues);

  vtkPaintWidget2(publicAPI, model);
}

export const newInstance = macro.newInstance(extend, 'vtkPaintWidget2');

export default { newInstance, extend };
