import HookCompanion from '../../utils/HookCompanion';
import { WidgetManagerProps } from './index';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';
import { View } from 'react-vtk-js';
import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

export interface WidgetManagerCompanionProps extends WidgetManagerProps {
  view: View;
}

class WidgetManagerCompanion extends HookCompanion<WidgetManagerCompanionProps> {
  widgetManager: vtkWidgetManager;

  slicingMode: SlicingMode | null;

  constructor(props: WidgetManagerCompanionProps) {
    super(props);

    this.widgetManager = vtkWidgetManager.newInstance();
  }

  mount() {
    const { view } = this.props;
    this.widgetManager.setRenderer(view.renderer);
    this.widgetManager.disablePicking();
  }

  unmount() {
    this.widgetManager.delete();
  }

  grabFocus(widget: any) {
    this.widgetManager.grabFocus(widget);
  }

  // TODO: add types, returns handle
  attachWidget(widget: any, viewType: ViewTypes): any {
    return this.widgetManager.addWidget(widget, viewType);
  }

  detachWidget(widget: any) {
    this.widgetManager.removeWidget(widget);
  }

  detachWidgets() {
    // @ts-ignore
    if (!this.widgetManager.isDeleted()) {
      this.widgetManager.removeWidgets();
    }
  }

  setSlicingMode(slicingMode: SlicingMode) {
    this.slicingMode = slicingMode;
  }
}

export interface WidgetInstance {
  name: string;
  widget: any;

  instantiateVtkWidget();
}

export interface LabelMapDrawerWidgetInstance extends WidgetInstance {
  handle: any;
  onPaintInteractionEnd: () => void;
}

export default WidgetManagerCompanion;
