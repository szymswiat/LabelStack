import HookCompanion from '../../utils/HookCompanion';
import { View } from 'react-vtk-js';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import { ImageData } from '../../contexts/ImageDataContext';
import { ImageVolumeRepresentationProps } from './index';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import colorMaps from './colorMaps';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import { getOrientation } from '../../constants/slicingModeToOrientation';
import { delay } from '../../utils';

export interface ImageVolumeRepresentationCompanionProps extends ImageVolumeRepresentationProps {
  view: View;
}

class ImageVolumeRepresentationCompanion extends HookCompanion<ImageVolumeRepresentationCompanionProps> {
  actor: vtkVolume;
  mapper: vtkVolumeMapper;

  colorFunction: vtkColorTransferFunction;
  piecewiseFunction: vtkPiecewiseFunction;

  constructor(props: ImageVolumeRepresentationCompanionProps) {
    super(props);

    this.actor = vtkVolume.newInstance();
    this.mapper = vtkVolumeMapper.newInstance();

    this.colorFunction = vtkColorTransferFunction.newInstance();
    this.piecewiseFunction = vtkPiecewiseFunction.newInstance(); // opacity function
  }

  mount() {
    const { view } = this.props;
    // @ts-ignore
    this.actor.setMapper(this.mapper);
    // @ts-ignore
    view.renderer.addActor(this.actor);

    this.colorFunction.applyColorMap(vtkColorMaps.getPresetByName(colorMaps.grayscale));

    this.actor.getProperty().setRGBTransferFunction(0, this.colorFunction);
    this.actor.getProperty().setScalarOpacity(0, this.piecewiseFunction);
    this.actor.getProperty().setScalarOpacityUnitDistance(0, 2);
    this.actor.getProperty().setInterpolationTypeToFastLinear();

    view.renderView();
  }

  unmount() {
    const { view } = this.props;
    if (view.renderer) {
      // @ts-ignore
      view.renderer.removeActor(this.actor);
    }
    this.actor.delete();
    this.mapper.delete();
    this.colorFunction.delete();
    this.piecewiseFunction.delete();
  }

  attachImageData(imageData: ImageData) {
    if (this.mapper.isDeleted()) {
      return;
    }
    const { view } = this.props;
    const { vtkImage } = imageData;

    // @ts-ignore
    this.mapper.setInputData(vtkImage);
    this.mapper.update();

    this.centerCamera();
    view.renderView();
  }

  async updateVisibilityByWindowLevel(windowWidth: number, windowCenter: number) {
    if (this.piecewiseFunction.isDeleted() || this.colorFunction.isDeleted()) {
      return;
    }

    const { view } = this.props;

    const [minVal, maxVal] = [windowCenter - windowWidth, windowCenter + windowWidth];

    this.colorFunction.setMappingRange(minVal, maxVal);

    this.piecewiseFunction.removeAllPoints();
    this.piecewiseFunction.addPoint(minVal, 0.001);
    this.piecewiseFunction.addPoint(maxVal, 0.05);

    view.renderView();
  }

  async centerCamera() {
    const { view } = this.props;
    const camera = view.renderer.getActiveCamera();
    const { sliceNormal, viewUp } = getOrientation(SlicingMode.J);
    camera.setDirectionOfProjection(sliceNormal[0], sliceNormal[1], sliceNormal[2]);
    camera.set({ viewUp });
    view.renderer.resetCamera();
    await delay(1);
    view.renderView();
  }
}

export default ImageVolumeRepresentationCompanion;
