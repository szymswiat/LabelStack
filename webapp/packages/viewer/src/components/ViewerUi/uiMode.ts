import { TabbedPanelElement } from '../../ui/components/TabbedPanel';
import { ToolBarElementData } from '../../ui/components/ToolBar';

export default interface UiMode {
  toolBarElements: ToolBarElementData[];
  leftPanels: TabbedPanelElement[];
  rightPanels: TabbedPanelElement[];
}
