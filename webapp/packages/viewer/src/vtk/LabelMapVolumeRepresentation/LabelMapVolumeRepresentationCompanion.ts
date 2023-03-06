import HookCompanion from '../../utils/HookCompanion';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import { LabelMapVolumeRepresentationProps } from './index';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { View } from 'react-vtk-js';
import { ImageData } from '../../contexts/ImageDataContext';
import { delay } from '../../utils';

export interface LabelMapVolumeRepresentationCompanionProps extends LabelMapVolumeRepresentationProps {
  view: View;
  imageData: ImageData;
}

class LabelMapVolumeRepresentationCompanion extends HookCompanion<LabelMapVolumeRepresentationCompanionProps> {
  labelMapId: string;
  mapper: vtkVolumeMapper;
  actor: vtkVolume;
  colorFunction: vtkColorTransferFunction;
  piecewiseFunction: vtkPiecewiseFunction;

  constructor(props: LabelMapVolumeRepresentationCompanionProps) {
    super(props);

    this.labelMapId = props.id;

    this.mapper = vtkVolumeMapper.newInstance();
    this.actor = vtkVolume.newInstance();
    this.colorFunction = vtkColorTransferFunction.newInstance();
    this.piecewiseFunction = vtkPiecewiseFunction.newInstance();
  }

  mount() {
    const {
      view,
      inputLabelMap: { visibility, color, data },
      opacity
    } = this.props;
    // @ts-ignore
    this.actor.setMapper(this.mapper);

    const [r, g, b] = color;

    this.colorFunction.addRGBPoint(1, r, g, b);
    this.piecewiseFunction.addPoint(0, 0);
    this.piecewiseFunction.addPoint(1, opacity * 0.025);

    this.actor.getProperty().setRGBTransferFunction(0, this.colorFunction);
    this.actor.getProperty().setScalarOpacity(0, this.piecewiseFunction);

    this.setLabelMapData(data);

    // @ts-ignore
    view.renderer.addActor(this.actor);

    this.actor.setVisibility(visibility);
  }

  unmount() {
    const { view } = this.props;
    if (view.renderer) {
      // @ts-ignore
      view.renderer.removeActor(this.actor);
    }
    this.actor.delete();
    this.mapper.delete();
  }

  async setVisibility(visibility: boolean) {
    const { view } = this.props;
    this.actor.setVisibility(visibility);
    await delay(1);
    view.renderView();
  }

  setLabelMapData(inputLabelMap: vtkImageData) {
    const { view } = this.props;
    this.mapper.setInputData(inputLabelMap);
    view.renderView();
  }

  setColor(color: number[]) {
    const { view } = this.props;
    const [r, g, b] = color;
    this.colorFunction.removeAllPoints();
    this.colorFunction.addRGBPoint(1, r, g, b);
    view.renderView();
  }
}

export default LabelMapVolumeRepresentationCompanion;
