import HookCompanion from '@labelstack/viewer/src/utils/HookCompanion';
import { BrushWidgetInstanceProps } from './index';
import vtkPaintWidget from '@kitware/vtk.js/Widgets/Widgets3D/PaintWidget';
import vtkPaintWidget2 from '../../widgets/vtkPaintWidget2';
import { LabelMapDrawerWidgetInstance } from '@labelstack/viewer/src/vtk/WidgetManager/WidgetManagerCompanion';
import { View } from 'react-vtk-js';

export interface BrushWidgetInstanceCompanionProps extends BrushWidgetInstanceProps {
  view: View;
}

class BrushWidgetInstanceCompanion
  extends HookCompanion<BrushWidgetInstanceCompanionProps>
  implements LabelMapDrawerWidgetInstance
{
  static widgetName = 'BRUSH';

  name: string;
  handle: any;
  widget: any;

  prevCursorType: string;

  onPaintInteractionEnd: () => void;

  instantiateVtkWidget(): vtkPaintWidget {
    return vtkPaintWidget2.newInstance() as vtkPaintWidget;
  }

  constructor(props: BrushWidgetInstanceCompanionProps) {
    super(props);

    this.name = BrushWidgetInstanceCompanion.widgetName;
  }

  mount() {
    const { labelMapDrawer, viewType, widgetManager, view } = this.props;
    const { paintFilter, slicingMode } = labelMapDrawer;

    const widget = this.instantiateVtkWidget();
    const handle = widgetManager.attachWidget(widget, viewType);

    widget.setVisibility(true);

    const direction = [0, 0, 0];
    direction[slicingMode] = 1;
    handle.getWidgetState().getHandle().setDirection(direction);

    // TODO: make this component common and inject interaction events?
    handle.onStartInteractionEvent(() => {
      paintFilter.startStroke();
      paintFilter.addPoint(widget.getWidgetState().getTrueOrigin());
    });
    handle.onInteractionEvent(() => {
      paintFilter.addPoint(widget.getWidgetState().getTrueOrigin());
    });
    handle.onEndInteractionEvent(() => {
      paintFilter.endStroke().then(() => this.onPaintInteractionEnd());
    });

    handle.setVisibility(true);
    handle.updateRepresentationForRender();

    widgetManager.grabFocus(widget);

    this.prevCursorType = view.renderWindow.getInteractor().getView().getCursor();
    view.renderWindow.getInteractor().getView().setCursor('none');

    this.widget = widget;
    this.handle = handle;
  }

  unmount() {
    const { widgetManager, view } = this.props;

    this.handle.delete();

    // TODO: no idea why internal vtk function called in detachWidget does not work
    // widgetManager.detachWidget(this.widget);
    widgetManager.detachWidgets();
    this.widget.delete();

    view.renderWindow.getInteractor().getView().setCursor(this.prevCursorType);
  }

  setWidgetSize(size: number) {
    this.widget.setRadius(size);
  }
}

export default BrushWidgetInstanceCompanion;
