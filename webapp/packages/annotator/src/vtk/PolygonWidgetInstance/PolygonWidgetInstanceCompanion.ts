import HookCompanion from '@labelstack/viewer/src/utils/HookCompanion';
import { LabelMapDrawerWidgetInstance } from '@labelstack/viewer/src/vtk/WidgetManager/WidgetManagerCompanion';
import { PolygonWidgetInstanceProps } from './index';
import vtkPaintWidget from '@kitware/vtk.js/Widgets/Widgets3D/PaintWidget';
import vtkSplineWidget2 from '../../widgets/vtkSplineWidget2';

export interface PolygonWidgetInstanceCompanionProps extends PolygonWidgetInstanceProps {}

class PolygonWidgetInstanceCompanion
  extends HookCompanion<PolygonWidgetInstanceCompanionProps>
  implements LabelMapDrawerWidgetInstance
{
  static widgetName = 'POLYGON';

  handle: any;
  name: string;
  widget: any;

  onPaintInteractionEnd: () => void;

  instantiateVtkWidget(): vtkPaintWidget {
    return vtkSplineWidget2.newInstance({
      resetAfterPointPlacement: true,
      resolution: 1
    }) as vtkPaintWidget;
  }

  constructor(props: PolygonWidgetInstanceCompanionProps) {
    super(props);

    this.name = PolygonWidgetInstanceCompanion.widgetName;
  }

  mount() {
    const { labelMapDrawer, widgetManager, viewType, imageData } = this.props;
    const { paintFilter } = labelMapDrawer;

    const widget = this.instantiateVtkWidget();
    const handle = widgetManager.attachWidget(widget, viewType);

    widget.setDragable(false);
    widget.setVisibility(true);

    const imageSpacing = imageData.vtkImage.getSpacing();
    handle.setHandleSizeInPixels(2 * Math.max(...imageSpacing));
    handle.setFreehandMinDistance(2 * Math.max(...imageSpacing));

    handle.onStartInteractionEvent(() => {
      paintFilter.startStroke();
    });
    handle.onEndInteractionEvent(() => {
      const points = handle.getPoints();
      paintFilter.paintPolygon(points);

      handle.updateRepresentationForRender();
      paintFilter.endStroke().then(() => this.onPaintInteractionEnd());
    });

    handle.setVisibility(true);
    handle.updateRepresentationForRender();
    handle.setOutputBorder(true);

    widgetManager.grabFocus(widget);

    this.widget = widget;
    this.handle = handle;
  }

  unmount() {
    const { widgetManager } = this.props;

    this.handle.delete();

    // TODO: no idea why internal vtk function called in detachWidget does not work
    // widgetManager.detachWidget(this.widget);
    widgetManager.detachWidgets();
    this.widget.delete();
  }
}

export default PolygonWidgetInstanceCompanion;
