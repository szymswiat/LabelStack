import HookCompanion from '../../utils/HookCompanion';
import { SliceViewProps } from './index';
import LabelMapSliceRepresentationCompanion from '../LabelMapSliceRepresentation/LabelMapSliceRepresentationCompanion';
import { ViewerLayoutApi } from '../../contexts/ViewerLayoutContext';
import WidgetManagerCompanion from '../WidgetManager/WidgetManagerCompanion';

export interface SliceViewCompanionProps extends SliceViewProps {}

class SliceViewCompanion extends HookCompanion<SliceViewCompanionProps> {
  labelMapRepresentations: Record<string, LabelMapSliceRepresentationCompanion>;
  widgetManager: WidgetManagerCompanion;

  viewerLayoutApi: ViewerLayoutApi;

  constructor(props: SliceViewCompanionProps) {
    super(props);

    this.labelMapRepresentations = {};
  }

  mount() {
    const { attachSliceView } = this.viewerLayoutApi;
    const { viewId } = this.props;
    attachSliceView(viewId, this);
  }

  unmount() {
    const { detachSliceView } = this.viewerLayoutApi;
    const { viewId } = this.props;
    detachSliceView(viewId);
  }

  setViewerLayoutContext(api: ViewerLayoutApi) {
    this.viewerLayoutApi = api;
  }

  attachLabelMapRepresentation(id: string, representation: LabelMapSliceRepresentationCompanion) {
    this.labelMapRepresentations[id] = representation;
    this.triggerHookUpdate();
  }
}

export default SliceViewCompanion;
