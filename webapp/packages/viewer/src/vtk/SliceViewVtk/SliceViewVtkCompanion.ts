import HookCompanion from '../../utils/HookCompanion';
import { SliceViewVtkProps } from './index';
import LabelMapSliceRepresentationCompanion from '../LabelMapSliceRepresentation/LabelMapSliceRepresentationCompanion';
import { ViewerLayoutApi } from '../../contexts/ViewerLayoutContext';
import WidgetManagerCompanion from '../WidgetManager/WidgetManagerCompanion';

export interface SliceViewVtkCompanionProps extends SliceViewVtkProps {}

class SliceViewVtkCompanion extends HookCompanion<SliceViewVtkCompanionProps> {
  labelMapRepresentations: Record<string, LabelMapSliceRepresentationCompanion>;
  widgetManager: WidgetManagerCompanion;

  viewerLayoutApi: ViewerLayoutApi;

  constructor(props: SliceViewVtkCompanionProps) {
    super(props);

    this.labelMapRepresentations = {};
  }

  mount() {
    const { attachSliceViewVtk } = this.viewerLayoutApi;
    const { viewId } = this.props;
    attachSliceViewVtk(viewId, this);
  }

  unmount() {
    const { detachSliceViewVtk } = this.viewerLayoutApi;
    const { viewId } = this.props;
    detachSliceViewVtk(viewId);
  }

  setViewerLayoutContext(api: ViewerLayoutApi) {
    this.viewerLayoutApi = api;
  }

  attachLabelMapRepresentation(id: string, representation: LabelMapSliceRepresentationCompanion) {
    this.labelMapRepresentations[id] = representation;
    this.triggerHookUpdate();
  }
}

export default SliceViewVtkCompanion;
