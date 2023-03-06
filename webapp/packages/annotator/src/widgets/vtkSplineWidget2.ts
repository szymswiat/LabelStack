import macro from '@kitware/vtk.js/macros';
import vtkSplineWidget from '@kitware/vtk.js/Widgets/Widgets3D/SplineWidget';

function widgetBehavior(parentBehavior: any) {
  return (publicAPI: any, model: any) => {
    parentBehavior(publicAPI, model);

    const parentHandleRightButtonPress = publicAPI.handleRightButtonPress;
    const parentHandleMouseMove = publicAPI.handleMouseMove;
    const parentHandleKeyDown = publicAPI.handleKeyDown;

    publicAPI.handleRightButtonPress = (callData: any) => {
      parentHandleRightButtonPress(callData);
      return macro.VOID;
    };

    publicAPI.handleMouseMove = (callData: any) => {
      parentHandleMouseMove(callData);
      return macro.VOID;
    };

    publicAPI.handleKeyDown = ({ key }: { key: string }) => {
      model.keysDown[key] = true;

      if (key === 'Escape') {
        publicAPI.reset();
        publicAPI.invokeEndInteractionEvent();
      } else {
        parentHandleKeyDown({ key });
      }
    };
  };
}

function vtkSplineWidget2(publicAPI: any, model: any) {
  model.classHierarchy.push('vtkSplineWidget2');

  model.behavior = widgetBehavior(model.behavior);
}

export function extend(publicAPI: any, model: any, initialValues = {}) {
  vtkSplineWidget.extend(publicAPI, model, initialValues);

  vtkSplineWidget2(publicAPI, model);
}

export const newInstance = macro.newInstance(extend, 'vtkSplineWidget2');

export default { newInstance, extend };
