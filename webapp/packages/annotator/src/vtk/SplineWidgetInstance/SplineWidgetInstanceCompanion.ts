import { SplineWidgetInstanceProps } from './index';
import vtkPaintWidget from '@kitware/vtk.js/Widgets/Widgets3D/PaintWidget';
import vtkSplineWidget2 from '../../widgets/vtkSplineWidget2';
import PolygonWidgetInstanceCompanion from '../PolygonWidgetInstance/PolygonWidgetInstanceCompanion';

export interface SplineWidgetInstanceCompanionProps extends SplineWidgetInstanceProps {}

class SplineWidgetInstanceCompanion extends PolygonWidgetInstanceCompanion {
  static widgetName = 'SPLINE';

  handle: any;
  name: string;
  widget: any;

  onPaintInteractionEnd: () => void;

  instantiateVtkWidget(): vtkPaintWidget {
    return vtkSplineWidget2.newInstance({
      resetAfterPointPlacement: true
    }) as vtkPaintWidget;
  }

  constructor(props: SplineWidgetInstanceCompanionProps) {
    super(props);

    this.name = SplineWidgetInstanceCompanion.widgetName;
  }
}

export default SplineWidgetInstanceCompanion;
